require 'aws-sdk'

require_relative 'constants'

target_account_id = ENV["TARGET_ACCOUNT_ID"]
puts "Target account Id: #{target_account_id}"
raise "Target account Id not specified" if target_account_id.nil?

purpose = ENV["PURPOSE"]
puts "purpose: #{purpose}"
raise "Purpose not specified" if purpose.nil?
stack_name = "#{purpose}"

organization_id = ENV["ORGANIZATION_ID"]
puts "Organization Id: #{organization_id}"
raise "Organization Id not specified" if organization_id.nil?

identity_account_id = ENV["IDENTITY_ACCOUNT_ID"]
puts "Identity account Id: #{identity_account_id}"

capabilities = []
capability_iam_needed_value = ENV["CAPABILITY_IAM_NEEDED"]
capabilities.push("CAPABILITY_IAM") if (capability_iam_needed_value and (not (capability_iam_needed_value.eql?("false"))))

capability_named_iam_needed_value = ENV["CAPABILITY_NAMED_IAM_NEEDED"]
capabilities.push("CAPABILITY_NAMED_IAM") if (capability_named_iam_needed_value and (not (capability_named_iam_needed_value.eql?("false"))))

unless capabilities.empty?
  puts "capabilities specified for #{stack_name}: #{capabilities}"
end

recreate_stack = ENV["RECREATE_STACK"] || false
puts "Recreate stack is set to #{recreate_stack} for #{stack_name}"

parameters = [
    {parameter_key: "OrganizationId", parameter_value: organization_id},
    {parameter_key: "IdentityAccountId", parameter_value: identity_account_id}
]

cf = Aws::CloudFormation::Client.new
sts = Aws::STS::Client.new
caller_identity = sts.get_caller_identity
current_account_id = caller_identity.account

unless (current_account_id.eql?(target_account_id))
  codebuild_build_id = ENV["CODEBUILD_BUILD_ID"]
  build_id = codebuild_build_id.nil? ? "some-build-id" : codebuild_build_id.split(':').last

  role_arn = "arn:aws:iam::#{target_account_id}:role/OrganizationAccountAccessRole";
  role_session_name = "#{build_id}"

  assume_role_response = sts.assume_role({role_arn: role_arn, role_session_name: role_session_name})
  credentials = assume_role_response.credentials
  cf = Aws::CloudFormation::Client.new(access_key_id: credentials.access_key_id, secret_access_key: credentials.secret_access_key, session_token: credentials.session_token)
end

stack_status = nil
stack_does_not_exist = false
puts "Reading stack status for stack #{stack_name}"

begin
  describe_response = cf.describe_stacks(stack_name: stack_name)
  stack_status = describe_response.stacks.first.stack_status
  puts "Stack #{stack_name} stack status: #{stack_status}"
rescue Aws::CloudFormation::Errors::ValidationError => ex
  puts "Rescuing error: #{ex.message}"
  stack_does_not_exist = true
end

def get_template(purpose)
  IO.read(File.join("..", "templates", "automated", purpose, "template.json"))
end

template_body = get_template(purpose)

if (Constants::GOOD_STATES.include? stack_status)

  puts "updating stack #{stack_name}"
  begin
    update_stack_response = cf.update_stack(stack_name: stack_name, template_body: template_body, parameters: parameters, capabilities: capabilities)
    puts "Stack #{stack_name} update requested with stack id #{update_stack_response.stack_id}"
  rescue Aws::CloudFormation::Errors::ValidationError => ex
    puts "Rescuing error: #{ex.message}"
    puts "No updates are applicable for stack #{stack_name}"
  end

elsif (recreate_stack and (Constants::BAD_STATES.include? stack_status))
  puts "deleting stack #{stack_name}"
  cf.delete_stack(stack_name: stack_name)
  cf.wait_until(:stack_delete_complete, stack_name: stack_name)

  puts "creating stack #{stack_name}"
  recreate_stack_response = cf.create_stack(stack_name: stack_name, template_body: template_body, parameters: parameters, capabilities: capabilities)
  puts "Stack #{stack_name} create requested with stack id #{recreate_stack_response.stack_id}"

elsif stack_does_not_exist

  puts "creating stack #{stack_name}"
  create_stack_response = cf.create_stack(stack_name: stack_name, template_body: template_body, parameters: parameters, capabilities: capabilities)
  puts "Stack #{stack_name} create requested with stack id #{create_stack_response.stack_id}"

else
  raise "Stack #{stack_name} not in good state: #{stack_status}"
end

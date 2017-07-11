require 'aws-sdk'


class MyOrganization

  REGION_VIRGINIA = 'us-east-1'

  def initialize(config = {})
    @config = config
    @config[:region] = REGION_VIRGINIA if config[:region].nil?
  end

  def create_organization
    org_client = Aws::Organizations::Client.new(@config)
    org_client.create_organization
  end

  def get_organization_id
    org_client = Aws::Organizations::Client.new(@config)
    org_client.describe_organization.organization.id
  end

  def get_master_account_id
    org_client = Aws::Organizations::Client.new(@config)
    org_client.describe_organization.organization.master_account_id
  end

  def get_region
    @config[:region] || REGION_VIRGINIA
  end

  def get_artifacts_bucket_name
    "artifacts-#{get_region}-#{get_master_account_id}"
  end

  def create_artifacts_bucket
    s3_client = Aws::S3::Client.new(@config)
    bucket = Aws::S3::Resource.new(client: s3_client).bucket(get_artifacts_bucket_name)
    bucket.create
  end

end

class CAMAccount
  attr_reader :name, :id, :email, :accountgroup

  def initialize(name, id, email, accountgroup = nil)
    @name = name
    @id = id
    @email = email
    @accountgroup = accountgroup
  end
end

module AccountsFormatter

  def self.out(accounts)
    indentation = "  "
    [
        "accounts:",
        "-",
        accounts.collect { |account| [
            "#{indentation}",
            "#{account.id} :\n",
            "#{indentation}#{indentation}",
            "email: #{account.email}"
        ].join("") },
    ].join("\n")
  end

end

class Role

  attr_reader :role_name, :policy_file, :accountgroup, :cam_action

  def initialize(role_name, policy_file, accountgroup = nil, cam_action = 'add')
    @role_name = role_name
    @policy_file = policy_file
    @accountgroup = accountgroup
    @cam_action = cam_action
  end

  def self.load_roles(file)
    roles_assignment = YAML.load(IO.read(file))
    roles_assignment['roles'].first.collect { |role| Role.new(role.first, role.last["policy"], role.last["accountgroup"], role.last["add"]) }
  end
end


class Function
  attr_reader :function_name, :contexts

  def initialize(function_name, contexts = nil)
    @function_name = function_name
    @contexts = contexts
  end

end

class MetadataNotFoundError < StandardError;
end

class Metadata
  def self.locate_metadata(base_path, function_name, context = nil)
    metadata_path = nil
    metadata_under_function = File.join(base_path, function_name, 'metadata.yml')
    metadata_path = metadata_under_function if FileTest.exist?(metadata_under_function)

    unless context.nil?
      metadata_under_context = File.join(base_path, function_name, 'contexts', context, 'metadata.yml')
      metadata_path = metadata_under_context if FileTest.exist?(metadata_under_context)
    end

    raise MetadataNotFoundError, "metadata not located for #{function_name}" if metadata_path.nil?
    metadata_path
  end
end

class AWSOrganization

  attr_reader :id, :master_account_id, :master_account_email, :ous

  def initialize(id, master_account_id, master_account_email, ous = [])
    @id = id
    @master_account_id = master_account_id
    @master_account_email = master_account_email
    @ous = ous
  end

  def to_s
    [
        "Organization: #{id} with master account #{master_account_id}",
        "organizational units:",
        ous.collect(&:to_s),
    ].flatten.join("\n")
  end

end

class AWSOrganizationalUnit
  attr_reader :id, :name, :parent_id, :account_ids

  def to_s
    [
        "OU #{id}: #{name}",
        @accounts.collect(&:to_s)
    ].join("\n")
  end

  def initialize(id, name, parent_id = nil, account_ids = [])
    @id = id
    @name = name
    @parent_id = parent_id
    @account_ids = account_ids
    @accounts = []
  end

  def add_account(account)
    @accounts << account
  end

  def is_member?(account_id)
    account_ids.include?(account_id)
  end

end

class AWSAccount
  attr_reader :id, :name, :email, :ou

  def to_s
    "#{id}: #{name}"
  end

  def initialize(id, email, name, ou = nil)
    @id = id
    @email = email
    @name = name
    @ou = ou
  end
end

module OrgFormatter
  def self.out(organization)
    organization.to_s
  end
end

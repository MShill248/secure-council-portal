variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro" 
}

variable "ec2_key_name" {
  description = "Name of an existing EC2 key pair in this region"
  type        = string
  default     = "scp-demo" # change if your keypair has a different name
}
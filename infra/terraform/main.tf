terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Use default VPC + its subnets (keeps things simple)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Latest Amazon Linux 2 (x86_64) for the chosen region
data "aws_ami" "al2" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# --------------------
# Security Groups
# --------------------

# API SG: SSH (22) + API (3000) from anywhere (demo-friendly)
resource "aws_security_group" "api_sg" {
  name        = "scp-api-sg"
  description = "Allow SSH and API traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API 3000"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "scp-api-sg" }
}

# DB SG: allow Postgres only from API SG
resource "aws_security_group" "db_sg" {
  name        = "scp-db-sg"
  description = "Allow Postgres from API SG"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres 5432 from API SG"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "scp-db-sg" }
}

# --------------------
# EC2 instances
# --------------------

# API server (public)
resource "aws_instance" "api" {
  ami                         = data.aws_ami.al2.id
  instance_type               = var.instance_type
  key_name                    = var.ec2_key_name
  vpc_security_group_ids      = [aws_security_group.api_sg.id]
  subnet_id                   = element(data.aws_subnets.default.ids, 0)
  associate_public_ip_address = true

  tags = {
    Name = "scp-api"
    Role = "api"
  }
}

# DB server (public for quick SSH; SG restricts 5432)
resource "aws_instance" "db" {
  ami                         = data.aws_ami.al2.id
  instance_type               = var.instance_type
  key_name                    = var.ec2_key_name
  vpc_security_group_ids      = [aws_security_group.db_sg.id]
  subnet_id                   = element(data.aws_subnets.default.ids, 1)
  associate_public_ip_address = true

  tags = {
    Name = "scp-db"
    Role = "db"
  }
}
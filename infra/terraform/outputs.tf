output "api_public_ip" {
  value = aws_instance.api.public_ip
}

output "api_public_dns" {
  value = aws_instance.api.public_dns
}

output "db_public_ip" {
  value = aws_instance.db.public_ip
}

output "db_public_dns" {
  value = aws_instance.db.public_dns
}

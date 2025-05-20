CREATE TABLE resource_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    permission ENUM('READ', 'CREATE', 'UPDATE', 'DELETE') NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT NULL,
    modified_by INT DEFAULT NULL,
    is_active BIT(1) DEFAULT b'1' COMMENT 'bản ghi này có đang được sử dụng ko. nếu ko đc sử dụng thì ko lấy lên giao diện',
    UNIQUE KEY uniq_resource_permission (resource_id, permission),
    FOREIGN KEY (resource_id) REFERENCES resource(id) ON DELETE CASCADE
);

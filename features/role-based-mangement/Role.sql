CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT NULL,
    modified_by INT DEFAULT NULL,
    is_active BIT(1) DEFAULT b'1' COMMENT 'bản ghi này có đang được sử dụng ko. nếu ko đc sử dụng thì ko lấy lên giao diện'
);

CREATE INDEX idx_role_name ON role (name);
CREATE INDEX idx_role_description ON role (description);

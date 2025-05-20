CREATE TABLE role_resource_permission (
    role_id INT NOT NULL,
    resource_permission_id INT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT NULL,
    modified_by INT DEFAULT NULL,
    is_active BIT(1) DEFAULT b'1' COMMENT 'bản ghi này có đang được sử dụng ko. nếu ko đc sử dụng thì ko lấy lên giao diện',
    PRIMARY KEY (role_id, resource_permission_id)
);

ALTER TABLE role_resource_permission
    ADD FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    ADD FOREIGN KEY (resource_permission_id) REFERENCES resource_permission(id) ON DELETE CASCADE;

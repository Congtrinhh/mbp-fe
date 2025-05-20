# Database

MySQL version 8.0.40

## Naming Conventions

-   snake_case for tables, fields.
-   use single form for table. eg: user, not users. post, not posts.
-   procedure: proc_user_get_paged (user entity), proc_user_get_by_id (user entity),proc_contract_get_by_id (contract entity), proc_contract_get_paged (contract entity).

# Note

-   every table has fields:
    id,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` int DEFAULT NULL,
    `modified_by` int DEFAULT NULL,
    `is_active` bit(1) DEFAULT b'1' COMMENT 'bản ghi này có đang được sử dụng ko. nếu ko đc sử dụng thì ko lấy lên giao diện',

# Don't

-   add index (except foreign key index)
-   read Db/ folder

# Do

-   use mcp_server_mysql mcp server to interact with the database
-   foreign key restrict on delete, update
-   use english concise comment for tables, fields. if comment on fields with value such as 1, 2,3, try to comment clearly which value means what.
-   care about default value if specified

create table pefcl_accounts
(
    id           int auto_increment,
    account_name varchar(255)                  not null,
    balance      int         default 0         not null,
    type         varchar(20) default 'default' not null,
    is_default   tinyint     default 1         not null,
    constraint pefcl_accounts_id_uindex
        unique (id)
);


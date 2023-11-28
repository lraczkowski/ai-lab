create table book
(
    id      integer not null
        constraint book_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);
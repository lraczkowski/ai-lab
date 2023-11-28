<?php

/** @var \App\Model\Book $book */
/** @var \App\Service\Router $router */

$title = "{$book->getSubject()} ({$book->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $book->getSubject() ?></h1>
    <article>
        <?= $book->getContent();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('book-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('book-edit', ['id'=> $book->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

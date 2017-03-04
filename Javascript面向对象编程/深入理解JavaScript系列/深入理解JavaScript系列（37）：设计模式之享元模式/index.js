/**************************************************************************
 * 设计模式之享元模式
 * 中介者模式（Mediator），用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。
 ***************************************************************************/
console.log('-----------在JavaScript里，中介者非常常见，相当于观察者模式上的消息Bus，只不过不像观察者那样通过调用pub/sub的形式来实现，而是通过中介者统一来管理，让我们在观察者的基础上来给出一个例子：------------------');

(function () {

    /*享元模式优化代码*/
    var Book = function (title, author, genre, pageCount, publisherID, ISBN) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.pageCount = pageCount;
        this.publisherID = publisherID;
        this.ISBN = ISBN;
    };
    // 定义基本工厂
    // 让我们来定义一个基本工厂，用来检查之前是否创建该book的对象，如果有就返回，没有就重新创建并存储以便后面可以继续访问，这确保我们为每一种书只创建一个对象：

    /* Book工厂 单例 */
    var BookFactory = (function () {
        var existingBooks = {};
        return {
            createBook: function (title, author, genre, pageCount, publisherID, ISBN) {
                /*查找之前是否创建*/
                var existingBook = existingBooks[ISBN];
                if (existingBook) {
                    return existingBook;
                } else {
                    /* 如果没有，就创建一个，然后保存*/
                    var book = new Book(title, author, genre, pageCount, publisherID, ISBN);
                    existingBooks[ISBN] = book;
                    return book;
                }
            }
        }
    });

    // 管理外部状态
    // 外部状态，相对就简单了，除了我们封装好的book，其它都需要在这里管理：

    /*BookRecordManager 借书管理类 单例*/
    var BookRecordManager = (function () {
        var bookRecordDatabase = {};
        return {
            /*添加借书记录*/
            addBookRecord: function (id, title, author, genre, pageCount, publisherID, ISBN, checkoutDate, checkoutMember, dueReturnDate, availability) {
                var book = BookFactory.createBook(title, author, genre, pageCount, publisherID, ISBN);
                bookRecordDatabase[id] = {
                    checkoutMember: checkoutMember,
                    checkoutDate: checkoutDate,
                    dueReturnDate: dueReturnDate,
                    availability: availability,
                    book: book

                };
            },
            updateCheckoutStatus: function (bookID, newStatus, checkoutDate, checkoutMember, newReturnDate) {
                var record = bookRecordDatabase[bookID];
                record.availability = newStatus;
                record.checkoutDate = checkoutDate;
                record.checkoutMember = checkoutMember;
                record.dueReturnDate = newReturnDate;
            },
            extendCheckoutPeriod: function (bookID, newReturnDate) {
                bookRecordDatabase[bookID].dueReturnDate = newReturnDate;
            },
            isPastDue: function (bookID) {
                var currentDate = new Date();
                return currentDate.getTime() > Date.parse(bookRecordDatabase[bookID].dueReturnDate);
            }
        };
    });

    console.log(BookRecordManager());
    // 通过这种方式，我们做到了将同一种图书的相同信息保存在一个bookmanager对象里，而且只保存一份；相比之前的代码，就可以发现节约了很多内存。
})();

/**
 * Flyweight模式是一个提高程序效率和性能的模式,会大大加快程序的运行速度.应用场合很多:比如你要从一个数据库中读取一系列字符串,这些字符串中有许多是重复的,那么我们可以将这些字符串储存在Flyweight池(pool)中。
 * 如果一个应用程序使用了大量的对象，而这些大量的对象造成了很大的存储开销时就应该考虑使用享元模式；还有就是对象的大多数状态可以外部状态，如果删除对象的外部状态，那么就可以用相对较少的共享对象取代很多组对象，此时可以考虑使用享元模式。
 */


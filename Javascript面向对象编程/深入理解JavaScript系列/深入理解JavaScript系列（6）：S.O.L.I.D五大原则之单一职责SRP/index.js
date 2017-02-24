/**************************************************************************
 * 深入理解JavaScript系列（6）：S.O.L.I.D五大原则之单一职责SRP
 ***************************************************************************/
/**
 * 一个类（JavaScript下应该是一个对象）应该有一组紧密相关的行为的意思是什么？遵守单一职责的好处是可以让我们很容易地来维护这个对象，当一个对象封装了很多职责的话，一旦一个职责需要修改，势必会影响该对象想的其它职责代码。通过解耦可以让每个职责工更加有弹性地变化。
 * 不过，我们如何知道一个对象的多个行为构造多个职责还是单个职责？我们可以通过参考Object Design: Roles, Responsibilies, and Collaborations一书提出的Role Stereotypes概念来决定，该书提出了如下Role Stereotypes来区分职责：

* Information holder – 该对象设计为存储对象并提供对象信息给其它对象。
* Structurer – 该对象设计为维护对象和信息之间的关系
* Service provider – 该对象设计为处理工作并提供服务给其它对象
* Controller – 该对象设计为控制决策一系列负责的任务处理
* Coordinator – 该对象不做任何决策处理工作，只是delegate工作到其它对象上
* Interfacer – 该对象设计为在系统的各个部分转化信息（或请求）
 */


// 让我们来分解一下，以便代码各自存放到各自的对象里，为此，我们参考了martinfowler的事件聚合（Event Aggregator）理论在处理代码以便各对象之间进行通信。
// 首先我们先来实现事件聚合的功能，该功能分为2部分，1个是Event，用于Handler回调的代码，1个是EventAggregator用来订阅和发布Event，代码如下：
function Event(name) {
    var handlers = [];

    this.getName = function () {
        return name;
    };

    this.addHandler = function (handler) {
        handlers.push(handler);
    };

    this.removeHandler = function (handler) {
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i] == handler) {
                handlers.splice(i, 1);
                break;
            }
        }
    };

    this.fire = function (eventArgs) {
        handlers.forEach(function (h) {
            h(eventArgs);
        });
    };
}

function EventAggregator() {
    var events = [];

    function getEvent(eventName) {
        return $.grep(events, function (event) {
            return event.getName() === eventName;
        })[0];
    }

    this.publish = function (eventName, eventArgs) {
        var event = getEvent(eventName);

        if (!event) {
            event = new Event(eventName);
            events.push(event);
        }
        event.fire(eventArgs);
    };

    this.subscribe = function (eventName, handler) {
        var event = getEvent(eventName);

        if (!event) {
            event = new Event(eventName);
            events.push(event);
        }

        event.addHandler(handler);
    };
}

// 然后，我们来声明Product对象，代码如下：
function Product(id, description) {
    this.getId = function () {
        return id;
    };
    this.getDescription = function () {
        return description;
    };
}

// 接着来声明Cart对象，该对象的addItem的function里我们要触发发布一个事件itemAdded，然后将item作为参数传进去。
function Cart(eventAggregator) {
    var items = [];

    this.addItem = function (item) {
        items.push(item);
        eventAggregator.publish('itemAdded', item);
    };
}

// CartController主要是接受cart对象和事件聚合器，通过订阅itemAdded来增加一个li元素节点，通过订阅productSelected事件来添加product。
function CartController(cart, eventAggregator) {
    eventAggregator.subscribe('itemAdded', function (eventArgs) {
        $('<li></li>').html(eventArgs.getDescription()).attr('id-cart', eventArgs.getId()).appendTo('#cart');
    });

    eventAggregator.subscribe('productSelected', function (eventArgs) {
        cart.addItem(eventArgs.product);
    });
}

// epository的目的是为了获取数据（可以从ajax里获取），然后暴露get数据的方法。
function ProductRepository() {
    var products = [
        new Product(1, 'Star Wars Lego Ship'),
        new Product(2, 'Barbie Doll'),
        new Product(3, 'Remote Control Airplane')
    ];

    this.getProducts = function () {
        return products;
    };
}

// ProductController里定义了一个onProductSelect方法，主要是发布触发productSelected事件，forEach主要是用于绑定数据到产品列表上，代码如下：
function ProductController(eventAggregator, productRepository) {
    var products = productRepository.getProducts();

    function onProductSelected() {
        var productId = $(this).attr('id');
        var product = $.grep(products, function (x) {
            return x.getId() == productId;
        })[0];
        eventAggregator.publish('productSelected', {
            product: product
        });
    }

    products.forEach(function (product) {
        $('<li></li>').html(product.getDescription())
            .attr('id', product.getId())
            .dblclick(onProductSelected)
            .appendTo('#products');
    });
}

// 最后声明匿名函数（需要确保HTML都加载完了才能执行这段代码，比如放在jQuery的ready方法里）：
(function () {
    var eventAggregator = new EventAggregator(),
        cart = new Cart(eventAggregator),
        cartController = new CartController(cart, eventAggregator),
        productRepository = new ProductRepository(),
        productController = new ProductController(eventAggregator, productRepository);
})();
/* globals Backbone _ $ */
// build a list views of books

// event aggregator to trigger a global event;
var eventAggregator = _.extend({}, Backbone.Events)


// model for books
var Books = [
    new Backbone.Model({
        title: 'Javascript',
        content: 'Javascript is a language that rocks!'
    }),
    new Backbone.Model({
        title: 'Ruby',
        content: 'Rusty Ruby is a good ruby!'
    })
];

var ContentsView = Backbone.View.extend({
    tagName: 'ul',
    render: function () {
        _.each(this.collection, function (book) {
            // append books to document
            this.$el.append(new BookView({model: book}).render().el)
        }, this)
        return this
    }
})

var BookView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click': function () {
          eventAggregator.trigger('book:selected', this.model)
      }  
    },
    render: function () {
        this.$el.html(this.model.get('title'))
        return this
    }
})
var fullBook = Backbone.View.extend({
    render: function () {
        this.$el.append('<h1>' + this.model.get('title') +'</h1>')
        this.$el.append('<div>' + this.model.get('content') +'</div>')
        return this
    }
})

var DocumentsRouter = Backbone.Router.extend({
    routes: {
        'contents': 'contents',
        'view/:title': 'viewBook'
    },
    contents: function () {
        $('body').html(new ContentsView({collection: Books}).render().el)
    },
    
    viewBook: function (title) {
        var selectedBook = _.find(Books, function (book) {
            return book.get('title') === title
        })
        $('body').empty().append(new fullBook({model: selectedBook}).render().el)
    }
})

eventAggregator.on('book:selected', function (book) {
    var urlPath = 'view/' + book.get('title')
    router.navigate(urlPath, {trigger:true})
})

var router = new DocumentsRouter()
Backbone.history.start()

router.navigate('contents', {trigger: true})
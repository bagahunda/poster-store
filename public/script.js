new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    results: [],
    cart: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: 9.99,
    loadNum: 10
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + this.loadNum);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http
          .get('/search/'.concat(this.newSearch))
          .then(function(res) {
            this.lastSearch = this.newSearch;
            this.results = res.data;
            this.appendItems();
            this.loading = false;
          })
        ;
      }
    },
    addItem: function(index) {
      this.total += this.price;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: this.price
        });
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += this.price;
    },
    dec: function(item) {
      item.qty--;
      this.total -= item.price;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0
    }
  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function() {
    this.onSubmit();
    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    })
  }
});
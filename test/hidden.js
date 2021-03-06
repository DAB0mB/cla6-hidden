var Chai = require('chai');
var Cla6 = require('cla6');

var expect = Chai.expect;
var spy = Chai.spy;

describe('Cla6', function() {
  describe('hidden', function() {
    it('should reveal hidden properties in methods', function() {
      var Klass = Cla6('Klass', {
        constructor: function(hidden) {
          this._hidden = hidden;
        },

        assert: function() {
          expect(this._hidden).to.equal('hidden');
        },

        get hidden() {
          return this._hidden;
        },

        set hidden(value) {
          this._hidden = value;
        }
      });

      var obj = new Klass('hidden');
      expect(obj._hidden).to.be.not.exist;
      
      obj.assert();
      expect(obj._hidden).to.be.not.exist;

      obj.hidden = 'new hidden';
      expect(obj.hidden).to.equal('new hidden');
    });
  });

  it('should reveal hidden prototype properties in methods', function() {
    var props = {
      _hidden: 'hidden',

      constructor: function() {
        this._assert();
      },

      _assert: function() {
        expect(this._hidden).to.equal('hidden');
      }
    };

    var Klass = Cla6('Klass', props);
    var proto = Klass.prototype;
    expect(proto._hidden).to.be.not.exist;
    expect(proto._assert).to.be.not.exist;

    var obj = new Klass();
    expect(obj._hidden).to.not.exist;
    expect(obj._assert).to.not.exist;
  });

  it('should inherit hidden prototype properties', function() {
    var Parent = Cla6('Parent', {
      _parentHidden: 'parentHidden',
      _childHidden: 'parentHidden'
    });

    var Child = Cla6('Child').extend(Parent, {
      _childHidden: 'childHidden',

      constructor: function() {
        expect(this._parentHidden).to.equal('parentHidden');
        expect(this._childHidden).to.equal('childHidden');
      }
    });

    new Child();
  });

  it('should swap external hidden properties with internal hidden properties', function() {
    var Klass = Cla6('Klass', {
      constructor: function() {
        this._internal = 'internal';
        this.revealed = 'revealed';
      },

      assert: function() {
        expect(this.revealed).to.equal('revealed');
        expect(this._internal).to.equal('internal');
        expect(this._external).to.be.not.exist;
      }
    });

    var obj = new Klass();
    obj._external = 'external';
    obj.assert();

    expect(obj.revealed).to.equal('revealed');
    expect(obj._external).to.equal('external');
    expect(obj._internal).to.be.not.exist;
  });

  it('should swap hidden properties back if an error was thrown', function() {
    var Klass = Cla6('Klass', {
      constructor: function() {
        this._internal = 'internal';
        this.revealed = 'revealed';
      },

      assert: function() {
        throw Error();
      }
    });

    var obj = new Klass();
    obj._external = 'external';
    
    try {
      obj.assert();
    } catch (e) {
      expect(obj.revealed).to.equal('revealed');
      expect(obj._external).to.equal('external');
      expect(obj._internal).to.be.not.exist;
    }
  });
});
var game = function(args){

	this.init();
	
};

game.prototype = {
	_lock: false,
	currentIndex: 0,
	score: 0,
	time: 100, //inSeconds
	currentBurger: [],
    drawBurger: [],
	burgerElements: [hamburger, alface, queijo],
	start_btn: false,
	
	init: function(stage){
		
		this.top = this.left = 10;
		
		this.gameStage = Raphael(0+this.left,0+this.top,800,600);
		
		this.gameStage.rect(0, 0, 800, 600, 10).attr({fill: "#87B043", stroke: 'none'});
		//drawAreaBackground
		this.gameStage.rect(20, 300, 460, 280, 10).attr({fill: "#ddd", stroke: 'none'});
		
		this.setHeader();
		
        this.setClickableArea();
		
		this.stage = Raphael(500+this.left,200+this.top,280,380);
		this.stage.rect(0, 0, 280, 380, 10).attr({fill: "#ddd", stroke: 'none'});
		this.stage.text(140, 20, "TIME").attr({fill: '#999', 'font-size': 20});
		this.stage.rect(50, 40, 180, 80, 10).attr({fill: "#eee", stroke: 'none'});
		
		this.currentBurgerStage = Raphael(500+this.left,340+this.top,280,180);
		
		this.timeStage = Raphael(500+this.left,250+this.top,180,80);
		
		this.start_btn = new start(this.stage);
		this.start_btn.scale(.3,.3);
		this.start_btn.translate(200,1080);
		SAPO.Dom.Event.observe(this.start_btn.node,'click',function(ev){
		    this.start_btn.node.style.display = 'none';
		    this.score = 0;
		    this.setScore();
		    this.generateNewBurger();
		    if(this.interval){
		        clearInterval(this.interval);
		    }
		    this.time = 100;
		    this.setTime();
		    this.interval = setInterval(this.setTime.bindObj(this), 1000);
		}.bindObjEvent(this));
		
		this.drawArea = Raphael(20+this.left,300+this.top,460,280);
		
	},
	setScore: function(){
	    this.scoreStage.clear();
	    this.scoreStage.text(50, 20, this.score).attr({fill: '#fff', 'font-size': 40});
	},
	setTime: function(){
	    this.timeStage.clear();
	    var text = this.timeStage.text(140,30,this.time).attr({fill: '#999', 'font-size': 40});
	    if(this.time <= 0){
	        text.attr({fill: '#f00'});
	        clearInterval(this.interval);
	        this._lock = true;
	        this.drawArea.clear();
	        this.currentBurgerStage.clear();
	        this.time = 100;
	        this.start_btn.node.style.display = 'block';
	        return false;
	    } else if(this.time <= 10){
	        text.attr({fill: '#f93'});
	    }
	    this.time -= 1;
	
	},
	addItemToBurger: function(type){
	    if(this._lock){
	        return false;
	    }
	    this.drawBurger[this.currentIndex] = type;
	    var item = new this.burgerElements[type](this.drawArea);
        item.scale(.4,.4);
        item.translate(350,500-(this.currentIndex*150));
        if(this.drawBurger[this.currentIndex] != this.currentBurger[this.currentIndex]){
            this.showError();
            return false;
        }
        
        this.currentIndex += 1;

        if(this.currentIndex == 3){
            this.showOk();
        }
	},
	showError: function(){
	    this.lock = true;
	    this.currentIndex = 0;
	    var error_btn = new error(this.drawArea);
		error_btn.scale(.4,.4);
		error_btn.translate(900,20);
		setTimeout(this.generateNewBurger.bindObj(this),1000);
	},
	showOk: function(){
	    this.lock = true;
	    this.score += 5;
	    this.setScore();
	    this.currentIndex = 0;
	    var ok_btn = new ok(this.drawArea);
		ok_btn.scale(.4,.4);
		ok_btn.translate(900,20);
		setTimeout(this.generateNewBurger.bindObj(this),1000);
	},
	generateNewBurger: function(){
	    this._lock = false;
	    this.drawArea.clear();
	    this.currentBurger = [Math.floor(Math.random()*2.999999999999,0),Math.floor(Math.random()*2.999999999999,0),Math.floor(Math.random()*2.999999999999,0)];
	    this.setCurrentBurgerElements();
	},
	setCurrentBurgerElements: function(){
		
		this.currentBurgerStage.clear();
		
		this.currentBurgerStage.rect(20, 0, 240, 180, 10).attr({fill: '#eee',stroke: 'none'});
		
		
		var pao_base_el = new pao_base(this.currentBurgerStage);
		pao_base_el.translate(140, 320);
		pao_base_el.scale(.4, .4);

		var el_1 = new this.burgerElements[this.currentBurger[0]](this.currentBurgerStage);
		el_1.translate(160, 280);
		el_1.scale(.4, .4);
		
		var el_2 = new this.burgerElements[this.currentBurger[1]](this.currentBurgerStage);
		el_2.translate(160, 190);
		el_2.scale(.4, .4);
		
		var el_3 = new this.burgerElements[this.currentBurger[2]](this.currentBurgerStage);
	    setInterval(function(){var c = this.getBBox();console.log(c);this.translate(c[0]++, c[1]++);}.bindObj(el_3),100);
		el_3.scale(.4, .4);
		
		var pao_topo_el = new pao_topo(this.currentBurgerStage);
		pao_topo_el.translate(140, 0);
		pao_topo_el.scale(.4, .4);
		
	},
	setHeader: function(){  
	    this.header = Raphael(20+this.left, 20+this.top, 760, 160)
		this.header.rect(0, 0, 760, 160, 10).attr({fill: "#ddd", stroke: 'none'});
		var logo_el = new logo(this.header);
		logo_el.scale(.65, .65);
		this.header.text(115, 55, "JS").attr({fill: '#3A4C28', 'font-size': 70});
        this.header.text(115, 90, "burger").attr({fill: '#3A4C28', 'font-size': 40});
        this.header.text(620, 40, "SCORE").attr({fill: '#3A4C28', 'font-size': 40});
        this.header.rect(520, 70, 200, 70, 10).attr({fill: '#3A4C28', stroke: 'none'});
        this.scoreStage = Raphael(570+20+this.left, 85+20+this.top, 200, 70);
        this.setScore();
	},
	setClickableArea: function(){
	    this.clickableAreaStage = Raphael(20+this.left, 200+this.top, 460, 80);
		this.clickableAreaStage.rect(0, 0, 460, 80, 10).attr({fill: "#ddd", stroke: 'none'});
		
		var hamburger_clickable = this.clickableAreaStage.rect(20, 10, 120, 60, 10).attr({fill: "#eee", stroke: '#555'});
		var hamburger_el = new hamburger(this.clickableAreaStage);
		hamburger_el.translate(80, 80);
		hamburger_el.scale(.3, .3);
		
		SAPO.Dom.Event.observe(hamburger_clickable.node, 'click', this.addItemToBurger.bindObj(this,0));
		SAPO.Dom.Event.observe(hamburger_el.node, 'click', this.addItemToBurger.bindObj(this,0));
		
		var alface_clickable = this.clickableAreaStage.rect(170, 10, 120, 60, 10).attr({fill: "#eee", stroke: '#555'});
		var alface_el = new alface(this.clickableAreaStage);
		alface_el.translate(560, 90);
		alface_el.scale(.3, .3);
		
		SAPO.Dom.Event.observe(alface_clickable.node, 'click', this.addItemToBurger.bindObj(this,1));
		SAPO.Dom.Event.observe(alface_el.node, 'click', this.addItemToBurger.bindObj(this,1));
		
		var queijo_clickable = this.clickableAreaStage.rect(320, 10, 120, 60, 10).attr({fill: "#eee", stroke: '#555'});
		var queijo_el = new queijo(this.clickableAreaStage);
		queijo_el.translate(1080, 100);
		queijo_el.scale(.3, .3);
		
		SAPO.Dom.Event.observe(queijo_clickable.node, 'click', this.addItemToBurger.bindObj(this,2));
		SAPO.Dom.Event.observe(queijo_el.node, 'click', this.addItemToBurger.bindObj(this,2));    
	}
	
};

var goPlay = new game();
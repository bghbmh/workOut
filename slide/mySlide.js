

'use strict';


var click = {

	findTagName : function(elem, tagName){

		let elemName = elem.nodeName;

		while( elemName !== tagName )
		{
			elem = elem.parentNode;

			if( elem === document ) 
				return null;

			elemName = elem.nodeName;
			//
		}	// console.log( 'while : ', elemName);
		return elem;
	},

	findClassName : function(items, className){

		for( let k = 0; k < items.children.length; k++ )
		{
			if( items.children[k].classList.contains(className) )
			{
				return k;
			}
		}
		return false;
	}

}

class mySlide{

	constructor(body, speed){
		this.body = body;
		this.items = null;
		this.map = null;		
		this.speed = speed;
		this.after = null;
		this.now = null;
		this.pause = "off";
		this.autoPlay = "stop";
		this.ongoingTouches = null;
		this.clicked = false;
		this.onboarding = false;
		this.init();
	}

	init(){
		//console.log("makeInit", this);

		if( this.body.querySelector('.slideMap') != null )
			return;

		this.items = this.body.querySelector('.items');
		this.items.children[0].style.left  = 0;
		this.items.children[0].classList.add('on');

		var slideMap = document.createElement('div'); //페이지네이션 생성

		for( var i = 0; i < this.items.children.length; i++ )//슬라이드 수만큼 만들
			slideMap.innerHTML += '<button class="locate"></button>';

		slideMap.innerHTML += '<button class="play"></button>';//자동 재생 버튼 설정

		slideMap.classList.add('slideMap');
		slideMap.children[0].classList.add('on');
		this.body.append(slideMap); // 페이지네이션 붙임

		this.map = this.body.querySelector('.slideMap');

		this.body.addEventListener("click", (e) => { this.clickMouse(e); }, false);
		this.body.addEventListener("mousedown", (e) => { this.clickMouse(e); }, false);
		this.body.addEventListener("mouseup", (e) => { this.clickMouse(e); }, false);
		// this.body.addEventListener("mousemove", (e) => { 
		// 	if( !this.clicked ) return;
		// 	this.clickMouse(e); 
		// });
		this.body.addEventListener("mouseover", (e) => { this.clickMouse(e); }, false);
		this.body.addEventListener("mouseout", (e) => { this.clickMouse(e); }, false);

		this.body.addEventListener("touchstart", (e) => { this.touchDevice(e); });
		this.body.addEventListener("touchmove", (e) => { this.touchDevice(e); });
		this.body.addEventListener("touchend", (e) => { this.touchDevice(e); });

	}

	touchDevice(e){

		if( e.target.tagName === "A") return;

		e.preventDefault();

		console.log("00 touchDevice", e);

		if( this.ongoingTouches === null || !Array.isArray(this.ongoingTouches) )
		{ //console.log("11 ongoingTouches reset");
			this.ongoingTouches = [];
		}
//console.log("touchDevice ", e);
		switch ( e.type )
		{
			case "touchstart":
			console.log("touchstart");
				if( Array.isArray(this.ongoingTouches) || this.ongoingTouches.length > 1 )
				{//console.log("22 ongoingTouches reset");
					this.ongoingTouches.length = 0;
				}
				
				for( let i=0; i<e.touches.length; i++ )
				{
					this.ongoingTouches.push(this.copyTouch(e.touches[i]));
					//console.log("touchstart", this.ongoingTouches[i].pageY, e.changedTouches[i].pageY);
				}

				this.body.querySelector(".controlBtn").style.display = "block";
				//setTimeout(() => { this.body.querySelector(".controlBtn").style.display = "none"; }, 6000);
				
				break;

			case "touchmove":
				
				//document.querySelector('html').scrollHeight
				let idx;
				for( let i=0; i<e.changedTouches.length; i++ )
				{
					idx = this.ongoingTouchIndexById(e.changedTouches[i].identifier);

					if (idx < 0) 
					{
						console.log("can't figure out which touch to continue");
						return;
					}					

					// Math.abs( this.ongoingTouches[0].screenY - e.changedTouches[0].screenY )
					if( Math.abs( this.ongoingTouches[0].pageY - e.changedTouches[0].pageY ) > 0)
					{		console.log("touchmove");				
						document.querySelector('html').scrollTop += (this.ongoingTouches[0].pageY - e.changedTouches[0].pageY);
					}

				}

				break;

			case "touchend":
			console.log("touchend");
				var t = e.changedTouches;

				let touchMovingX = this.ongoingTouches[0].screenX - e.changedTouches[0].screenX;
				let touchMovingY = this.ongoingTouches[0].screenY - e.changedTouches[0].screenY;				

				if( window.innerHeight/7 > Math.abs( touchMovingY ) && Math.abs( touchMovingY ) > window.innerHeight/10 )
				{	
					let slidingID = null;
					let next=1;
					let st = document.querySelector('html').scrollTop;

					console.log("setInterval__touchMoving ");
					if( touchMovingY < 0 ) next = -1;
					
					slidingID = setInterval(function(){

						if(document.querySelector('html').scrollTop === 0 || Math.abs( st - document.querySelector('html').scrollTop ) > 320 )// font-size 16px 기준
						{
							console.log("end setInterval__touchMoving");
							clearInterval(slidingID);
						}
						document.querySelector('html').scrollTop += (8*next);

					 }, 10);
				}
					
				//console.log("innerWidth ", window.innerWidth);
				let elem = click.findTagName(e.target, "BUTTON");				
				
				if( touchMovingX === 0 &&  elem !== null )
				{
					console.log("2 touchDevice");
					this.executeSlide(elem, "next");
				}
				else if( Math.abs( touchMovingX ) > window.innerWidth/10 &&  elem === null )
				{
					if( touchMovingX > 0 ) this.executeSlide(elem, "next");
					else this.executeSlide(elem, "prev");
				}
				break;

			case "touchcancel":

				console.log("2 touchcancel");

			break;
		}
				
	}

	copyTouch({ identifier, pageX, pageY, screenX, screenY }) {
		return { identifier, pageX, pageY, screenX, screenY };
	}

	ongoingTouchIndexById(idToFind) {
		for (var i = 0; i < this.ongoingTouches.length; i++)
		{
			var id = this.ongoingTouches[i].identifier;

			if (id == idToFind)
			{
				return i;
			}
		}
		return -1;    // not found
	}


	clickMouse(e){
		//e.stopPropagation();

		if( this.ongoingTouches === null || Array.isArray(this.ongoingTouches) )
		{ //console.log( "touchDevice  isArray", this);
			this.ongoingTouches = {};
		}

		switch ( e.type )
		{
			case "mouseover":
			//console.log( "11 mouseover ");

				//if( this.onboarding == true ) return;

				this.body.querySelector(".controlBtn").style.display = "block";
				this.onboarding = true;
			break;

			case "mousedown":

			console.log( "11 mousedown ", e);

				this.clicked = true;

				// if( e.target.tagName === "IMG" )
				// {
				// 	//e.stopPropagation();
				// 	// e.target.addEventListener("mousemove", (e) => { console.log( "IMG clickMouse ", e);this.clickMouse(e); });
				// 	e.target.addEventListener("mouseup", (e) => { console.log( "IMG clickMouse ", e);this.clickMouse(e); });
				// }
				
				this.ongoingTouches.x = e.x;
				this.ongoingTouches.elem = click.findTagName(e.target, "BUTTON");
				
			break;

			case "mousemove":
			console.log( "11 mousemove ");
				if( e.target.tagName === "IMG" )
				{		//console.log("img mousemove", e); // && Math.abs( this.ongoingTouches.x - e.x ) > 0				
					
				}

			break;

			case "mouseup":

			console.log( "11 mouseup ");

				this.clicked = false;
				if( e.target.tagName === "IMG" )
				{
					console.log("IMG mouseup", this.clicked);
				}
				else
				{
					console.log("IMG mouseup", this.clicked);
				}

				
				let dir = "";

				if( this.ongoingTouches.x - e.x === 0 && this.ongoingTouches.elem === null) 
				{
					return;
				}
				
				if( this.ongoingTouches.x - e.x > 0 )
				{
					dir = "next";
				}
				else 
				{
					dir = "prev";
				}

				this.executeSlide(this.ongoingTouches.elem, dir);

				//console.log( "22 mouseup ", this.ongoingTouches);
			break;

			case "mouseout":
			//console.log( "11 mouseout ", this.clicked);
				this.body.querySelector(".controlBtn").style.display = "none";
				
				
			break;
		}
	}

	isOnSlide(clickX, clickY){

		let area = this.body.getBoundingClientRect();

		if( clickX > area.x && clickX < area.x + area.width )
		{
			if( clickY > area.y && clickY < area.y + area.height )
			{
				//console.log("11 isOnSlide ", clickX, clickY );
				return true;
			}
		}

		return false;

	}

	executeSlide(elem, str){

		let exe;

		if( elem !== null )
		{
			if( elem.classList.length > 1 )
				exe = elem.classList[0];
			else
				exe = elem.className;
		}
		else
		{
			exe = str;
		}

		switch( exe )
		{
			case "next":
				this.checkAutoPlay();				
				this.move(1);
				break;

			case "prev":
				this.checkAutoPlay();
				this.move(-1);		
				break;

			case "play":
				elem.classList.add("stop");	
				elem.classList.remove("play");
				this.autoPlay =  setInterval( () => { this.move(1); }, 6000);
				break;

			case "stop":
				clearInterval(this.autoPlay);
				this.autoPlay = "stop";//console.log("stop ",this);
				elem.classList.add("play");
				elem.classList.remove("stop");
				break;		

			case "locate":
				this.checkAutoPlay();

				let init = { after : -1,  now : null, direction : null, width : this.items.offsetWidth};
				let slideMap = elem;

				while( slideMap != null ) 
				{
					slideMap = slideMap.previousElementSibling;
					init.after++; // 클릭한 슬라이드 번호
				}
				init.now = click.findClassName(this.items, "on");

				if( init.after - init.now > 0 ) init.direction = 1;
				else init.direction = -1;

				if( Math.abs(init.after - init.now) == 1 ) 
				{
					this.move(init.direction);
				}
				else if( Math.abs(init.after - init.now) > 1 ) // 간격이 2이상인 경우
				{ console.log("12345678 ",init.after - init.now);
					
					setTimeout(() => { this.quickLocate(init.width, init.now, init.after, init.direction) }, init.width/5);
				}

				break;	

		}

	}

	move(order){

		this.now = click.findClassName(this.items, "on");

		if( order > 0 && this.now >= this.items.children.length - 1 )
			this.after = 0;
		else if( order < 0 && this.now < 1  )
			this.after = this.items.children.length - 1;					
		else
			this.after = this.now + order;	

		var prevLeft = 0;
		var nextLeft;
		var setMovement = null;
		var after = this.after;
		var now = this.now;
		var speed = this.speed;
		var items = this.items;

		console.log("\n 9999 move ",this.speed,"\n");
		
		nextLeft = this.items.offsetWidth * order;

		setMovement = setInterval( () => {

			nextLeft -= (speed * order);

			if( order > 0 ) //next
			{
				if( nextLeft <= 0 )
				{
					nextLeft = 0;
					clearInterval(setMovement);
				}
			}
			else //prev
			{				
				if( nextLeft >= 0 )
				{
					nextLeft = 0;
					clearInterval(setMovement);
				}
			}

			prevLeft -= (speed * order);

			items.children[after].style.left = nextLeft + 'px';
			items.children[now].style.left = prevLeft + 'px';

		}, 0);

		items.children[after].classList.add('on');
		items.children[now].classList.remove('on');			

		this.map.children[after].classList.add('on');
		this.map.children[now].classList.remove('on');
	}


	checkAutoPlay(){

		if( this.autoPlay !== "stop" && this.pause === "off" )
		{
			clearInterval(this.autoPlay);
			this.autoPlay = "stop";
			//this.pause = "on";

			this.autoPlay =  setInterval( () => { this.move(1); }, 6000);
		}
	}

	quickLocate(w, now, after, dir){

		//console.log("00 quickLocate ", w);

		this.move(dir);

		if( Math.abs( after-now ) == 1 )
			return;

		now += dir;
		setTimeout(() => { this.quickLocate(w, now, after, dir) }, w/2);

	}
}
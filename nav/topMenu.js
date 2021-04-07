'use strict';


/* main */

function controlClickMenu(e){

	//e.stopPropagation();

	let menuD2 = this.querySelectorAll(".depth2");

	switch ( e.type )
	{
		case "mousedown":		
		case "mouseover":
			if( e.target.tagName === "A" && e.target.parentNode.parentNode.id === "depth1")
			{
				let elem = e.target.parentNode;
				let idx = -1;

				while( elem != null )
				{
					elem = elem.previousElementSibling;
					idx++;
				}

				this.classList.add("on");
				menuD2[idx].classList.add("on");
				
			}

		break;
		case "mouseup":
		case "mouseout":
		console.log("6  ",  e.type);
				
			if( e.y >= this.offsetHeight )
			{
				for( let i=0; i<menuD2.length; i++ )
					menuD2[i].classList.remove("on");

				this.classList.remove("on");	
			}
			else if( e.y < menuD2[0].parentNode.offsetHeight )
			{
				//console.log("out ", e.y, e.returnValue, window.event.returnValue );
					
				for( let i=0; i<menuD2.length; i++ )
					menuD2[i].classList.remove("on");

				let m = this.querySelectorAll(".depth1 > li");
				let depth1_right = depth1.getBoundingClientRect().left + ( m[0].getBoundingClientRect().width * m.length);

				if( e.y < 0 || e.x <= depth1.getBoundingClientRect().left || e.x >= depth1_right )
				{
					this.classList.remove("on");
				}
					
			}
			else
			{
				if( e.x <= 5 || e.x >= window.innerWidth-100 )
				{
					for( let i=0; i<menuD2.length; i++ )
						menuD2[i].classList.remove("on");

					this.classList.remove("on");	
				}
			}

		break;
	}
}

function controlTouchMenu(e){

	let menuD1 = this.querySelectorAll(".depth1 > li");
	let menuD2 = this.querySelectorAll(".depth2");

	switch ( e.type )
	{
		case "click":
		case "touchend":
			console.log("1  ", e.type);
			if( e.target.tagName === "A" && e.target.parentNode.parentNode.id === "depth1")
			{
				let elem = e.target.parentNode;
				let idx = -1;

				while( elem != null )
				{
					elem = elem.previousElementSibling;
					idx++;
				}

				for(let i=0; i<menuD1.length; i++ )
					menuD1[i].classList.remove("on");

				for(let i=0; i<menuD2.length; i++ )
					menuD2[i].classList.remove("on");

				menuD1[idx].classList.add("on");
				menuD2[idx].classList.add("on");

				e.preventDefault();

			}

		break;

	}
}


function initMenu(){

	let nav = document.querySelector("nav");

	if( window.innerWidth > 1024 )
	{

		nav.addEventListener("mousedown", controlClickMenu);
		nav.addEventListener("mouseover", controlClickMenu);
		nav.addEventListener("mouseout", controlClickMenu);

		nav.classList.remove("on");
		document.querySelector("#mobile_gnb").classList.remove("on");
		document.querySelector("#mobile_gnb").classList.add("off");

		let list = nav.querySelectorAll(".depth1 > li");
		for( let i=0; i<list.length; i++ )
		{
			list[i].classList.remove("on");
			list[i].querySelector(".depth2").classList.remove("on");
		}
		
	}
	else
	{
		document.querySelector("#mobile_gnb").addEventListener("click", showMobileMenu );	
	}


}

function showMobileMenu(e){

	let nav = document.querySelector("nav");

	if( this.classList.contains("off") )
	{		

		nav.removeEventListener("mousedown", controlClickMenu);
		nav.removeEventListener("mouseover", controlClickMenu);
		nav.removeEventListener("mouseout", controlClickMenu);

		nav.addEventListener("click", controlTouchMenu);
		nav.addEventListener("touchend", controlTouchMenu);
		console.log( this);

		nav.classList.add("on");
		this.classList.add("on");
		this.classList.remove("off");

		nav.querySelector(".depth1 > li").classList.add("on");
		nav.querySelector(".depth1 > li").querySelector(".depth2").classList.add("on");		
	}
	else
	{
		if( this.classList.contains("on") )
		{
			this.classList.remove("on");
			document.querySelector("nav").classList.remove("on");
		}
		else
		{
			this.classList.add("on");
			nav.classList.add("on");
		}
	}


}




// window.addEventListener("beforeunload", function (e) {
// event.returnValue = "\o/";
// 	//
// //   var confirmationMessage = "\o/";
// // alert("beforeunload" + confirmationMessage);
// //   (e || window.event).returnValue = confirmationMessage;     // Gecko + IE
// //   return confirmationMessage;                                /* Safari, Chrome, and other
// //                                                               * WebKit-derived browsers */
// });
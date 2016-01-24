"use strict" ;

var def = gxd.def || { } ;

def.DIRECTION = new Enum(
{
	UP		: 0 ,
	DOWN	: 1 ,
	LEFT	: 2 ,
	RIGHT	: 3
} ,
{
	name :
	{
		this	: "Direction" ,
		UP		: "Up" ,
		DOWN	: "Down" ,
		LEFT	: "Left" ,
		RIGHT	: "Right"
	}
} ) ;
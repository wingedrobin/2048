/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @copyright
 * @license
 */

"use strict" ;

var comp = gxd.comp || { } ;
var proj = gxd.proj || { } ;

comp.ColorBlockWithNumber = cc.LayerColor.extend(
/** @lends comp.ColorBlockWithNumber */
{
	_number			: null ,
	_numberLabel	: null ,
	_actions		: null ,
	
	ctor : function( number , color , width , height )
	{
		this._super( color , width , height ) ;
		
		this._number = number ;
		this._numberLabel = new cc.LabelTTF( number ,
											 comp.ColorBlockWithNumber.fontName ,
											 comp.ColorBlockWithNumber.fontSize ) ;
		
		this._numberLabel.setPosition( width * 0.5 , height * 0.5 ) ;
		this.addChild( this._numberLabel ) ;
	} ,
	
	free : function( )
	{
		this._number		= null ;
		this._numberLabel	= null ;
		this.removeAllChildren( ) ;
	} ,
	
	reset : function( number )
	{
		this.setNumber( number ) ;
		this._changeBlockColor( ) ;
		this._changeNumberLabelColor( ) ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	setNumber : function( number )
	{
		this._number = number ;
		this._numberLabel.setString( this._number ) ;
	} ,
	
	getNumber : function( )
	{
		return this._number ;
	} ,
	
	_changeBlockColor : function( )
	{
		this.setColor( cc.color( proj.config[ "colorBlock" ]
											[ "blockColor" ]
											[ String( this._number ) ]
											[ "backgroundColor" ] ) ) ;
	} ,
	
	_changeNumberLabelColor : function( )
	{
		this._numberLabel.setFontFillColor( cc.color( proj.config[ "colorBlock" ]
																 [ "blockColor" ]
																 [ String( this._number ) ]
																 [ "fontColor" ] ) ) ;
	} ,
	
	moveTo : function( position )
	{
		this._actions = cc.moveTo( comp.ColorBlockWithNumber.moveDuration , position ) ;
		this.runAction( this._actions ) ;
	} ,
	
	merge : function( colorBlock )
	{
		var sum = this._number + colorBlock.getNumber( ) ;
		this.setNumber( sum ) ;
		this._changeBlockColor( ) ;
		this._changeNumberLabelColor( ) ;
		
		this._actions = cc.sequence( [ cc.scaleTo( comp.ColorBlockWithNumber.scaleDuration ,
												   comp.ColorBlockWithNumber.enlargeFactor ,
												   comp.ColorBlockWithNumber.enlargeFactor ) ,
									   cc.scaleTo( comp.ColorBlockWithNumber.scaleDuration ,
												   comp.ColorBlockWithNumber.shrinkFactor ,
												   comp.ColorBlockWithNumber.shrinkFactor ) ] ) ;
		
		this.runAction( this._actions ) ;
	} ,
	
	isAllActionsDone : function( )
	{
		return this._actions.isDone( ) ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
		// this.removeAllChildren( ) ;
		// this.free( ) ;
	}
} ) ;

Object.defineProperty( comp.ColorBlockWithNumber , "fontName" ,
{
	value		: "Arial" ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.ColorBlockWithNumber , "fontSize" ,
{
	value		: 60 ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.ColorBlockWithNumber , "moveDuration" ,
{
	value		: 0.2 ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.ColorBlockWithNumber , "scaleDuration" ,
{
	value		: 0.1 ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.ColorBlockWithNumber , "enlargeFactor" ,
{
	value		: 1.2 ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.ColorBlockWithNumber , "shrinkFactor" ,
{
	value		: 1.0 ,
	enumerable	: true
} ) ;
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
	
	/**
	 * Constructor function.
	 * @function
	 */
	ctor : function( number , color , width , height )
	{
		this._super( color , width , height ) ;
		
		this._number		= number ;
		this._numberLabel	= new cc.LabelTTF( number ,
											   comp.ColorBlockWithNumber.fontName ,
											   comp.ColorBlockWithNumber.fontSize ) ;
		
		this._numberLabel.setPosition( width * 0.5 , height * 0.5 ) ;
		this._changeNumberLabelColor( ) ;										// 修正
		this.addChild( this._numberLabel ) ;
	} ,
	
	/**
	 *
	 * @function
	 */
	free : function( )
	{
		this._number		= null ;
		this._numberLabel	= null ;
		this.removeAllChildren( ) ;
	} ,
	
	/**
	 * Reset the color block.
	 *
	 * @function
	 * @param		{number}	Number of color block.
	 */
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
	
	/**
	 * Set the number of color block.
	 *
	 * @function
	 * @param		{number}	Number of color block.
	 */
	setNumber : function( number )
	{
		this._number = number ;
		this._numberLabel.setString( this._number ) ;
	} ,
	
	/**
	 * Get the number of color block.
	 *
	 * @function
	 * @return		{number}	Number of color block.
	 */
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
	
	/**
	 * Move the color block to specific position by cc.moveTo action.
	 *
	 * @function
	 * @param		{cc.p}	New position.
	 */
	moveTo : function( position )
	{
		this._actions = cc.moveTo( comp.ColorBlockWithNumber.moveDuration , position ) ;
		this._actions.retain( ) ;
		this.runAction( this._actions ) ;
	} ,
	
	/**
	 * To merge other color block.
	 *
	 * @function
	 * @param		{gxd.comp.ColorBlockWithNumber}	Color block which to be merge.
	 */
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
		
		this._actions.retain( ) ;
		this.runAction( this._actions ) ;
	} ,
	
	/**
	 * Check if all actions of color block is done.
	 *
	 * @function
	 * @return		{boolean}
	 */
	isAllActionsDone : function( )
	{
		var done = this._actions.isDone( ) ;
		
		if( done )
		{
			this._actions.release( ) ;
			this._actions = null ;
		}
		
		return done ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
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
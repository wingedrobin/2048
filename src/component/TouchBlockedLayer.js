/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @copyright
 * @license
 */
 
 "use strict" ;

var comp = gxd.comp || { } ;

comp.TouchBlockedLayer = cc.LayerColor.extend(
{
	_touchListener	: null ,
	
	ctor : function( color , width , height )
	{
		this._super( color , width , height ) ;
		
		this._touchListener = cc.EventListener.create(
		{
			event				: cc.EventListener.TOUCH_ONE_BY_ONE ,
			swallowTouches		: true ,
			onTouchBegan		: this._onTouchBegan.bind( this )
		} ) ;
		
		this._touchListener.retain( ) ;
	} ,
	
	free : function( )
	{
		this._touchListener.release( ) ;
		this._touchListener = null ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
		cc.eventManager.addListener( this._touchListener , this ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	_onTouchBegan : function( touch , event )
	{
		var touchedTarget	= event.getCurrentTarget( ) ;
		var locationInNode	= touchedTarget.convertToNodeSpace( touch.getLocation( ) ) ;
		var targetSize		= touchedTarget.getContentSize( ) ;
		var targetRect		= cc.rect( 0 , 0 , targetSize.width , targetSize.height ) ;
		
		if( !cc.rectContainsPoint( targetRect , locationInNode ) )
			return false ;
		
		return true ;
	} ,
	
	show : function( )
	{
	} ,
	
	hide :function( )
	{
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
		cc.eventManager.removeListener( this._touchListener ) ;
	}
} ) ;
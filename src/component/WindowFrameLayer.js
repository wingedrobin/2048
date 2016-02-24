/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @copyright
 * @license
 *
 *
 * @todo	Use an buffer to retain the one of block that after merge. To reduce the call of "new".
 */

"use strict" ;

var comp	= gxd.comp || { } ;
var def		= gxd.def || { } ;
var proj	= gxd.proj || { } ;

comp.WindowFrameLayer = cc.LayerColor.extend(
/** @lends WindowFrameLayer */
{
	_className		: "WindowFrameLayer" ,
	
	_rows				: null ,
	_columns			: null ,
	_frameSize			: null ,
	_framesOriginal		: null ,
	_drawNode			: null ,
	_touchPoint			: null ,
	_moveFinished		: null ,
	_touchListener		: null ,
	_frameContainer		: null ,
	_emptyFrame			: null ,	// 初始化 0~rows*columns-1
	_lastActiveBlock	: null ,
	_unusedBlockBuffer	: null ,
	_reachMaxNumber		: null ,
	
	/**
	 *
	 * @
	 * @param	{cc.color}	Color of layer.
	 * @param	{number}	Width of layer.
	 * @param	{number}	Height of layer.
	 * @param	{number}	Rows of window frame.
	 * @param	{number}	Columns of window frame.
	 */
	ctor : function( color , width , height , rows , columns )
	{
		this._super( color , width , height ) ;
		
		this._rows				= rows ;
		this._columns			= columns ;
		this._framesOriginal	= [ ] ;
		this._drawNode			= new cc.DrawNode( ) ;
		
		this.addChild( this._drawNode ) ;
		
		this.reset( ) ;
		
		this._calcFrameSize( ) ;
		this._calcFramesOriginal( ) ;
		this._createTouchListener( ) ;
	} ,
	
	/**
	 * Destructor.
	 * @function
	 */
	free : function( )
	{
		this._drawNode.clear( ) ;
		
		this._framesOriginal.length		= 0 ;
		this._framesOriginal			= null ;
		
		this._touchListener				= null ;
		
		for( var row of this._frameContainer )
			for( var block of row )
				if( block )
				{
					block.release( ) ;
					block.free( ) ;
				}
		
		this._frameContainer.length		= 0 ;
		this._frameContainer			= null ;
		
		this._emptyFrame.length			= 0 ;
		this._emptyFrame				= null ;
		
		this._lastActiveBlock			= null ;
		
		for( var block of this._unusedBlockBuffer )
		{
			block.release( ) ;
			block.free( ) ;
		}
		
		this._unusedBlockBuffer.length	= 0 ;
		this._unusedBlockBuffer			= null ;
	} ,
	
	/**
	 * @function
	 */
	reset : function( )
	{
		this._emptyFrame		= ( new Array( this._rows * this._columns ) ).fill( true ) ;
		
		if( !this._unusedBlockBuffer )
		{
			this._unusedBlockBuffer	= [ ] ;
		}
		
		if( !this._frameContainer )
		{
			this._frameContainer = [ ] ;
			
			for( var i = 0 ; i < this._rows ; i ++ )
			{
				this._frameContainer[ i ] = [ ] ;
			}
		}
		else
		{
			for( var i = 0 ; i < this._rows ; i ++ )
			{
				for( var j = 0 ; j < this._columns ; j ++ )
				{
					if( this._frameContainer[ i ][ j ] )
					{
						this._unusedBlockBuffer.push( this._frameContainer[ i ][ j ] ) ;
						this._frameContainer[ i ][ j ].removeFromParent( ) ;
						this._frameContainer[ i ][ j ] = null ;
					}
				}
			}
		}
		
		this._reachMaxNumber = false ;
	} ,
	
	/**
	 * @function
	 * @complexity	O(1)
	 */
	_calcFrameSize : function( )
	{
		var padding 	= comp.WindowFrameLayer.padding ;
		var width		= ( ( this.width - padding ) / this._columns ) - padding ;
		var height		= ( ( this.height - padding ) / this._rows ) - padding ;
		
		this._frameSize = cc.size( width , height ) ;
	} ,
	
	/**
	 * @function
	 * @complexity	O(n^2)
	 */
	_calcFramesOriginal : function( )
	{
		var position	= null ;
		var padding		= comp.WindowFrameLayer.padding ;
		
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			this._framesOriginal[ i ] = [ ] ;
			
			for( var j = 0 ; j < this._columns ; j ++ )
			{
				position = cc.p( ( j + 1 ) * padding + ( j * this._frameSize.width ) ,
								 ( i + 1 ) * padding + ( i * this._frameSize.height ) ) ;
				
				this._framesOriginal[ i ][ j ] = position ;
			}
		}
	} ,
	
	/**
	 * @function
	 * @complexity	O(n^2)
	 */
	_drawWindowFrame : function( )
	{
		var destination = null ;
		
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			for( var j = 0 ; j < this._columns ; j ++ )
			{
				destination = cc.p( this._framesOriginal[ i ][ j ].x + this._frameSize.width ,
									this._framesOriginal[ i ][ j ].y + this._frameSize.height ) ;
				
				this._drawNode.drawRect( this._framesOriginal[ i ][ j ] ,
										 destination ,
										 cc.color( proj.config[ "windowFrame" ][ "frameColor" ] ) ,
										 0 ,
										 cc.color( proj.config[ "windowFrame" ][ "frameColor" ] ) ) ;
			}
		}
	} ,
	
	getFrameSize : function( )
	{
		return this._frameSize ;
	} ,
	
	_createTouchListener : function( )
	{
		this._touchListener = cc.EventListener.create(
		{
			event				: cc.EventListener.TOUCH_ONE_BY_ONE ,
			swallowTouches		: true ,
			onTouchBegan		: this._onTouchBegan.bind( this ) ,
			onTouchMoved		: this._onTouchMoved.bind( this ) ,
			onTouchEnded		: this._onTouchEnded.bind( this ) ,
			onTouchCancelled	: this._onTouchCancelled.bind( this )
		} ) ;
		
		cc.eventManager.addListener( this._touchListener , this ) ;
	} ,
	
	_onTouchBegan : function( touch , event )
	{
		var touchedTarget	= event.getCurrentTarget( ) ;
		var locationInNode	= touchedTarget.convertToNodeSpace( touch.getLocation( ) ) ;
		var targetSize		= touchedTarget.getContentSize( ) ;
		var targetRect		= cc.rect( 0 , 0 , targetSize.width , targetSize.height ) ;
		
		if( !cc.rectContainsPoint( targetRect , locationInNode ) )
			return false ;
		
		this._moveFinished	= false ;
		this._touchPoint	= this.convertTouchToNodeSpace( touch ) ;
		
		return true ;
	} ,
	
	_onTouchMoved : function( touch , event )
	{
		if( this._moveFinished )
			return ;
	
		var currentPoint	= this.convertTouchToNodeSpace( touch ) ;
		var distance		= cc.pSub( currentPoint , this._touchPoint ) ;
		
		if( cc.pLength( distance ) < comp.WindowFrameLayer.touchDistanceThreshold )
			return ;
		
		var direction = null ;
		
		if( Math.abs( distance.x ) > Math.abs( distance.y ) )
		{
			if( distance.x > comp.WindowFrameLayer.touchDistanceThreshold )
			{
				direction = def.DIRECTION.RIGHT ;
			}
			else
			{
				direction = def.DIRECTION.LEFT ;
			}
		}
		else
		{
			if( distance.y > 0 )
			{
				direction = def.DIRECTION.UP ;
			}
			else
			{
				direction = def.DIRECTION.DOWN ;
			}
		}
		
		this._moveFinished = true ;
		
		if( direction !== null )
		{
			this._moveBlock( direction ) ;
			
			if( this._lastActiveBlock )
			{
				this.scheduleUpdate( ) ;
			}
		}
	} ,
	
	_onTouchEnded : function( touch , event )
	{
	} ,
	
	_onTouchCancelled : function( touch , event )
	{
	} ,
	
	_moveBlock : function( direction )
	{
		switch( direction )
		{
			case gxd.def.DIRECTION.UP :
			case gxd.def.DIRECTION.DOWN :
				this._moveVertically( direction ) ;
				break ;
			case gxd.def.DIRECTION.LEFT :
			case gxd.def.DIRECTION.RIGHT :
				this._moveHorizontally( direction ) ;
				break ;
		}
	} ,
	
	_moveHorizontally : function( direction )
	{
		var isLeftward	= ( direction === gxd.def.DIRECTION.LEFT ) ;
		var variance	= isLeftward ? 1 : -1 ;
		var invariance	= isLeftward ? this._columns : -1  ;
		var j			= isLeftward ? 1 : this._columns - 1 - 1 ;
		var flag		= isLeftward ? 0 : this._columns - 1 ;
		
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			while( j !== invariance )
			{
				if( this._frameContainer[ i ][ j ] )
				{
					if( this._frameContainer[ i ][ flag ] )
					{
						// Same number, then merge two block.
						if( this._frameContainer[ i ][ j ].getNumber( ) === this._frameContainer[ i ][ flag ].getNumber( ) )
						{
							this._frameContainer[ i ][ j ].moveTo( this._framesOriginal[ i ][ flag ] ) ;
							this._frameContainer[ i ][ flag ].merge( this._frameContainer[ i ][ j ] ) ;
							this._frameContainer[ i ][ j ].removeFromParent( ) ;
							
							this._unusedBlockBuffer.push( this._frameContainer[ i ][ j ] ) ;
							this._frameContainer[ i ][ j ] = null ;
							
							this._emptyFrame[ i * this._rows +  j ] = true ;
							this._emptyFrame[ i * this._rows + flag ] = false ;
							
							this._lastActiveBlock = this._frameContainer[ i ][ flag ] ;
							
							if( this._frameContainer[ i ][ flag ].getNumber( ) ===
								proj.config[ "maxNumber" ] )
							{
								this._reachMaxNumber = true ;
							}
						}
						// Differen number
						else
						{
							// Shift the flag.
							flag += variance ;
							
							// Flag not equal to current column, then move to position of flag.
							if( flag !== j )
							{
								this._frameContainer[ i ][ j ].moveTo( this._framesOriginal[ i ][ flag ] ) ;
								this._frameContainer[ i ][ flag ] = this._frameContainer[ i ][ j ] ;
								this._frameContainer[ i ][ j ] = null ;
								this._emptyFrame[ i * this._rows +  j ] = true ;
								this._emptyFrame[ i * this._rows + flag ] = false ;
							
								this._lastActiveBlock = this._frameContainer[ i ][ flag ] ;
							}
						}
					}
					// There has no block on flag's position, then move the block to flag.
					else
					{
						this._frameContainer[ i ][ j ].moveTo( this._framesOriginal[ i ][ flag ] ) ;
						this._frameContainer[ i ][ flag ] = this._frameContainer[ i ][ j ] ;
						this._frameContainer[ i ][ j ] = null ;
						this._emptyFrame[ i * this._rows +  j ] = true ;
						this._emptyFrame[ i * this._rows + flag ] = false ;
							
						this._lastActiveBlock = this._frameContainer[ i ][ flag ] ;
					}
				}
				
				j += variance ;
			}
			
			j		= isLeftward ? 1 : ( this._columns - 1 ) - 1 ;
			flag	= isLeftward ? 0 : this._columns - 1 ;
		}
	} ,
	
	_moveVertically : function( direction )
	{
		var isUpward	= ( direction === gxd.def.DIRECTION.UP ) ;
		var variance	= isUpward ? -1 : 1 ;
		var invariance	= isUpward ? -1 : this._rows ;
		var j			= isUpward ? this._rows - 1 - 1 : 1 ;
		var flag		= isUpward ? this._rows - 1 : 0 ;
		
		for( var i = 0 ; i < this._columns ; i ++ )
		{
			while( j !== invariance )
			{
				if( this._frameContainer[ j ][ i ] )
				{
					if( this._frameContainer[ flag ][ i ] )
					{
						if( this._frameContainer[ j ][ i ].getNumber( ) === this._frameContainer[ flag ][ i ].getNumber( ) )
						{
							this._frameContainer[ j ][ i ].moveTo( this._framesOriginal[ flag ][ i ] ) ;
							this._frameContainer[ flag ][ i ].merge( this._frameContainer[ j ][ i ] ) ;
							this._frameContainer[ j ][ i ].removeFromParent( ) ;
							
							this._unusedBlockBuffer.push( this._frameContainer[ j ][ i ] ) ;
							this._frameContainer[ j ][ i ] = null ;
							
							this._emptyFrame[ j * this._rows + i ] = true ;
							this._emptyFrame[ flag * this._rows + i ] = false ;
							
							this._lastActiveBlock = this._frameContainer[ flag ][ i ] ;
							
							if( this._frameContainer[ flag ][ i ].getNumber( ) ===
								proj.config[ "maxNumber" ] )
							{
								this._reachMaxNumber = true ;
							}
						}
						else
						{
							flag += variance ;
							
							if( flag !== j )
							{
								this._frameContainer[ j ][ i ].moveTo( this._framesOriginal[ flag ][ i ] ) ;
								this._frameContainer[ flag ][ i ] = this._frameContainer[ j ][ i ] ;
								this._frameContainer[ j ][ i ] = null ;
								this._emptyFrame[ j * this._rows + i ] = true ;
								this._emptyFrame[ flag * this._rows + i ] = false ;
							
								this._lastActiveBlock = this._frameContainer[ flag ][ i ] ;
							}
						}
					}
					else
					{
						this._frameContainer[ j ][ i ].moveTo( this._framesOriginal[ flag ][ i ] ) ;
						this._frameContainer[ flag ][ i ] = this._frameContainer[ j ][ i ] ;
						this._frameContainer[ j ][ i ] = null ;
						this._emptyFrame[ j * this._rows + i ] = true ;
						this._emptyFrame[ flag * this._rows + i ] = false ;
							
						this._lastActiveBlock = this._frameContainer[ flag ][ i ] ;
					}
				}
				
				j += variance ;
			}
			
			j		= isUpward ? this._rows - 1 - 1 : 1 ;
			flag	= isUpward ? this._rows - 1 : 0 ;
		}
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
		this._drawWindowFrame( ) ;
		
		this._generateNewBlock( ) ;
		this._generateNewBlock( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	_generateNewBlock : function( )
	{
		var indices = this._getEmptyFrameIndices( ) ;
		
		if( indices.length === 0 )
			return ;
		
		var rand	= Math.floor( ( Math.random( ) * 100 ) ) % indices.length ;
		var index	= indices[ rand ] ;
		
		var row		= Math.floor( index / this._rows ) ;
		var column	= index % this._rows ;
		
		if( this._unusedBlockBuffer.length > 0 )
		{
			this._frameContainer[ row ][ column ] = this._unusedBlockBuffer.shift( ) ;
			this._frameContainer[ row ][ column ].reset( 2 ) ;
		}
		else
		{
			this._frameContainer[ row ][ column ] = new comp.ColorBlockWithNumber( 2 ,
																				   cc.color( proj.config[ "colorBlock" ]
																										[ "blockColor" ]
																										[ String( 2 ) ]
																										[ "backgroundColor" ] ) ,
																				   this._frameSize.width ,
																				   this._frameSize.height ) ;
			
			this._frameContainer[ row ][ column ].retain( ) ;
		}
		
		this._frameContainer[ row ][ column ].setPosition( this._framesOriginal[ row ][ column ] ) ;
		this._emptyFrame[ row * this._rows + column ] = false ;
		this.addChild( this._frameContainer[ row ][ column ] ) ;
		
		if( indices.length === 1 )
		{
			if( this.isGameOver( ) )
				this.getParent( ).gameOver( false ) ;
		}
	} ,
	
	update : function( )
	{
		if( this._lastActiveBlock.isAllActionsDone( ) )
		{
			if( this._reachMaxNumber )
			{
				this.gameComplete( ) ;
			}
			else
			{
				this._generateNewBlock( ) ;
			}
			
			this.unscheduleUpdate( ) ;
			this._lastActiveBlock = null ;
		}
	} ,
	
	_getEmptyFrameIndices : function( )
	{
		var emptyFrameIndices = [ ] ;
		
		for( var i = 0 ; i < this._emptyFrame.length ; i ++ )
		{
			if( this._emptyFrame[ i ] )
				emptyFrameIndices.push( i ) ;
		}
		
		return emptyFrameIndices ;
	} ,
	
	isFrameFull : function( )
	{
		var indices = this._getEmptyFrameIndices( ) ;
		
		if( indices.length === 0 )
			return true ;
		else
			return false ;
	} ,
	
	isGameOver : function( )
	{
		for( var i = 0 ; i < this._rows ; i ++ )
		{
			for( var j = 0 ; j < this._columns - 1 ; j ++ )
			{
				if( this._frameContainer[ i ][ j ].getNumber( ) ===
					this._frameContainer[ i ][ j + 1 ].getNumber( ) )
				{
					return false ;
				}
			}
		}
		
		for( var i = 0 ; i < this._columns ; i ++ )
		{
			for( var j = 0 ; j < this._rows - 1 ; j ++ )
			{
				if( this._frameContainer[ j ][ i ].getNumber( ) ===
					this._frameContainer[ j + 1 ][ i ].getNumber( ) )
				{
					return false ;
				}
			}
		}
		
		return true ;
	} ,
	
	gameComplete : function( )
	{
		this.getParent( ).gameOver( true ) ;
	} ,
	
	onExitTransitionDidStart : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
		
		cc.eventManager.removeListener( this._touchListener ) ;
		
		this._drawNode.clear( ) ;
		this.free( ) ;
		this.removeAllChildren( ) ;
	}
} ) ;

Object.defineProperty( comp.WindowFrameLayer , "padding" ,
{
	value		: 20 ,
	enumerable	: true
} ) ;

Object.defineProperty( comp.WindowFrameLayer , "touchDistanceThreshold" ,
{
	value		: 30 ,
	enumerable	: true
} ) ;
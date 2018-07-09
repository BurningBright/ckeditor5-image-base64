/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/imageupload/imageuploadui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import { isImageType, findOptimalInsertionPosition } from './utils';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

/**
 * The image upload button plugin.
 * Adds the `imageUpload` button to the {@link module:ui/componentfactory~ComponentFactory UI component factory}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUploadUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;


        // Setup `imageUpload` button.
        editor.ui.componentFactory.add( 'imageUpload', locale => {
            const view = new FileDialogButtonView( locale );
            const command = editor.commands.get( 'imageUpload' );

            view.set( {
                acceptedType: 'image/*',
                allowMultipleFiles: true
            } );

            view.buttonView.set( {
                label: t( 'Insert image' ),
                icon: imageIcon,
                tooltip: true
            } );

            view.buttonView.bind( 'isEnabled' ).to( command );

            view.on( 'done', ( evt, files ) => {
                for ( const file of Array.from( files ) ) {
                    
                    if ( isImageType( file ) ) {
                        
                        var reader  = new FileReader();
                        reader.addEventListener( "load", function () {
                            editor.model.enqueueChange( () => {
                                const imageElement = new ModelElement( 'image', {
                                    src: reader.result
                                });
                                editor.model.insertContent( imageElement, editor.model.document.selection );
                            });

                          }, false);
                        
                      if (file) 
                          reader.readAsDataURL(file);
                    }
                }
            } );

            return view;
        } );
    }
}

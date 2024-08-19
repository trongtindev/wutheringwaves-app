/**
 * Image metadata in Google Images.
 * https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata?hl=en
 */
export interface IJsonLdImageObject {
  '@context': 'https://schema.org/';
  '@type': 'ImageObject';
  /**
   * A URL to the actual image content. Google uses contentUrl to determine which image the photo metadata applies to.
   * Example: https://example.com/photos/1x1/black-labrador-puppy.jpg
   */
  contentUrl: string;

  /**
   * A URL to a page where the user can find information on how to license that image.
   * Example: https://example.com/how-to-use-my-images
   */
  acquireLicensePage?: string;

  /**
   * The name of the person and/or organization that is credited for the image when it's published.
   * Example: Wuthering Waves
   */
  creditText?: string;

  /**
   * The creator of the image. This is usually the photographer, but it may be a company or organization (if appropriate).
   */
  creator?: {
    '@type': 'Person' | 'Organization';
    /**
     * The name of the creator.
     */
    name: string;
  };

  /**
   * The copyright notice for claiming the intellectual property for this photograph. This identifies the current owner of the copyright for the photograph.
   * Example: Clara Kent
   */
  copyrightNotice?: string;

  /**
   * A URL to a page that describes the license governing an image's use. For example, it could be the terms and conditions that you have on your website. Where applicable, it could also be a Creative Commons License (for example, BY-NC 4.0).
   * If you're using structured data to specify image, you must include the license property for your image to be eligible to be shown with the Licensable badge. We recommend that you also add the acquireLicensePage property if you have that information.
   * Example: https://example.com/license
   */
  license?: string;
}

import styled, { CSSProperties, DefaultTheme } from 'styled-components';

import handleResponsiveValues from '../helpers/handleResponsiveValues';
import { extractStyleFromTheme } from '../helpers/theme';

import { PickType } from '../types/utils';

type SpaceProps = keyof DefaultTheme['spaces'] | Array<keyof DefaultTheme['spaces']>;

export interface BoxProps
  extends Pick<
    CSSProperties,
    | 'pointerEvents'
    | 'display'
    | 'position'
    | 'zIndex'
    | 'overflow'
    | 'cursor'
    | 'transition'
    | 'transform'
    | 'animation'
    | 'textAlign'
    | 'textTransform'
    | 'lineHeight'
  > {
  /**
   * JavaScript hover handler
   */
  _hover?: (theme: DefaultTheme) => string;
  /**
   * Background color
   */
  background?: keyof DefaultTheme['colors'];
  /**
   * Flex basis
   */
  basis?: PickType<CSSProperties, 'flexBasis'>;
  /**
   * Border color
   */
  borderColor?: keyof DefaultTheme['colors'];
  /**
   * Text color
   */
  color?: keyof DefaultTheme['colors'];
  /**
   * Flex
   */
  flex?: PickType<CSSProperties, 'flex'>;
  fontSize?: keyof DefaultTheme['fontSizes'] | PickType<CSSProperties, 'fontSize'>;
  /**
   * Flex grow
   */
  grow?: PickType<CSSProperties, 'flexGrow'>;
  /**
   * If `true`, will add a border radius to the `Box`
   */
  hasRadius?: boolean;
  /**
   * Responsive hiding. If `true`, will the `Box` for tablet size screens.
   */
  hiddenS?: boolean;
  /**
   * Responsive hiding. If `true`, will the `Box` for mobile size screens.
   */
  hiddenXS?: boolean;
  /**
   * Padding. Supports responsive values
   */
  padding?: SpaceProps;
  /**
   * Padding bottom. Supports responsive values
   */
  paddingBottom?: SpaceProps;
  /**
   * Padding left. Supports responsive values
   */
  paddingLeft?: SpaceProps;
  /**
   * Padding right. Supports responsive values
   */
  paddingRight?: SpaceProps;
  /**
   * Padding top. Supports responsive values
   */
  paddingTop?: SpaceProps;
  marginLeft?: SpaceProps;
  marginBottom?: SpaceProps;
  marginRight?: SpaceProps;
  marginTop?: SpaceProps;
  /**
   * Shadow name (see `theme.shadows`)
   */
  shadow?: keyof DefaultTheme['shadows'];
  /**
   * Flex shrink
   */
  shrink?: PickType<CSSProperties, 'flexShrink'>;

  width?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  minWidth?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  maxWidth?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  height?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  minHeight?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  maxHeight?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  top?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  left?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  bottom?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  right?: keyof DefaultTheme['spaces'] | PickType<CSSProperties, 'width'>;
  borderRadius?: PickType<CSSProperties, 'borderRadius'>;
  borderStyle?: PickType<CSSProperties, 'borderStyle'>;
  borderWidth?: PickType<CSSProperties, 'borderWidth'>;

  children?: React.ReactNode;
}

/**
 * Prevents these attributes from being spread on the DOM node
 */
const transientProps: Partial<Record<keyof BoxProps, boolean>> = {
  color: true,
};

export const Box = styled.div.withConfig<BoxProps>({
  shouldForwardProp: (prop, defPropValFN) => !transientProps[prop as keyof BoxProps] && defPropValFN(prop),
})`
  // Font
  font-size: ${({ fontSize, theme }) => extractStyleFromTheme(theme.fontSizes, fontSize, fontSize)};

  // Colors
  background: ${({ theme, background }) => extractStyleFromTheme(theme.colors, background, undefined)};
  color: ${({ theme, color }) => extractStyleFromTheme(theme.colors, color, undefined)};

  // Spaces
  ${({ theme, padding }) => handleResponsiveValues('padding', padding, theme)}
  ${({ theme, paddingTop }) => handleResponsiveValues('padding-top', paddingTop, theme)}
  ${({ theme, paddingRight }) => handleResponsiveValues('padding-right', paddingRight, theme)}
  ${({ theme, paddingBottom }) => handleResponsiveValues('padding-bottom', paddingBottom, theme)}
  ${({ theme, paddingLeft }) => handleResponsiveValues('padding-left', paddingLeft, theme)}
  ${({ theme, marginLeft }) => handleResponsiveValues('margin-left', marginLeft, theme)}
  ${({ theme, marginRight }) => handleResponsiveValues('margin-right', marginRight, theme)}
  ${({ theme, marginTop }) => handleResponsiveValues('margin-top', marginTop, theme)}
  ${({ theme, marginBottom }) => handleResponsiveValues('margin-bottom', marginBottom, theme)}

  // Responsive hiding
  ${({ theme, hiddenS }) => (hiddenS ? `${theme.mediaQueries.tablet} { display: none; }` : undefined)}
  ${({ theme, hiddenXS }) => (hiddenXS ? `${theme.mediaQueries.mobile} { display: none; }` : undefined)}
  

  // Borders
  border-radius: ${({ theme, hasRadius, borderRadius }) => (hasRadius ? theme.borderRadius : borderRadius)};
  border-style: ${({ borderStyle }) => borderStyle};
  border-width: ${({ borderWidth }) => borderWidth};
  border-color: ${({ borderColor, theme }) => extractStyleFromTheme(theme.colors, borderColor, undefined)};
  border: ${({ theme, borderColor, borderStyle, borderWidth }) => {
    // This condition prevents borderColor from override the border-color attribute when not passing borderStyle nor borderWidth
    if (borderColor && !borderStyle && !borderWidth) {
      return `1px solid ${theme.colors[borderColor]}`;
    }

    // eslint-disable-next-line consistent-return
    return undefined;
  }};

  // Shadows
  box-shadow: ${({ theme, shadow }) => extractStyleFromTheme(theme.shadows, shadow, undefined)};

  // Handlers
  pointer-events: ${({ pointerEvents }) => pointerEvents};
  &:hover {
    ${({ _hover, theme }) => (_hover ? _hover(theme) : undefined)}
  }

  // Display
  display: ${({ display }) => display};

  // Position
  position: ${({ position }) => position};
  left: ${({ left, theme }) => extractStyleFromTheme(theme.spaces, left, left)};
  right: ${({ right, theme }) => extractStyleFromTheme(theme.spaces, right, right)};
  top: ${({ top, theme }) => extractStyleFromTheme(theme.spaces, top, top)};
  bottom: ${({ bottom, theme }) => extractStyleFromTheme(theme.spaces, bottom, bottom)};
  z-index: ${({ zIndex }) => zIndex};
  overflow: ${({ overflow }) => overflow};

  // Size
  width: ${({ width, theme }) => extractStyleFromTheme(theme.spaces, width, width)};
  max-width: ${({ maxWidth, theme }) => extractStyleFromTheme(theme.spaces, maxWidth, maxWidth)};
  min-width: ${({ minWidth, theme }) => extractStyleFromTheme(theme.spaces, minWidth, minWidth)};
  height: ${({ height, theme }) => extractStyleFromTheme(theme.spaces, height, height)};
  max-height: ${({ maxHeight, theme }) => extractStyleFromTheme(theme.spaces, maxHeight, maxHeight)};
  min-height: ${({ minHeight, theme }) => extractStyleFromTheme(theme.spaces, minHeight, minHeight)};

  // Animation
  transition: ${({ transition }) => transition};
  transform: ${({ transform }) => transform};
  animation: ${({ animation }) => animation};

  //Flexbox children props
  flex-shrink: ${({ shrink }) => shrink};
  flex-grow: ${({ grow }) => grow};
  flex-basis: ${({ basis }) => basis};
  flex: ${({ flex }) => flex};

  // Text
  text-align: ${({ textAlign }) => textAlign};
  text-transform: ${({ textTransform }) => textTransform};
  line-height: ${({ lineHeight }) => lineHeight};

  // Cursor
  cursor: ${({ cursor }) => cursor};
`;

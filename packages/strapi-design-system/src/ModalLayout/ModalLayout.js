import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Box } from '../Box';
import { Flex } from '../Flex';
import { FocusTrap } from '../FocusTrap';
import { Portal } from '../Portal';
import { ModalContext } from './ModalContext';
import { DismissibleLayer } from '../DismissibleLayer';

import useLockScroll from '../helpers/useLockScroll';

const ModalWrapper = styled(Flex)`
  inset: 0;
  background: ${({ theme }) => `${theme.colors.neutral800}1F`};
`;

const ModalContent = styled(Box)`
  width: ${830 / 16}rem;
`;

export const ModalLayout = ({ onClose, labelledBy, ...props }) => {
  useLockScroll(true);

  return (
    <Portal>
      <ModalContext.Provider value={onClose}>
        <ModalWrapper justifyContent="center" paddingLeft={8} paddingRight={8} position="fixed" zIndex={4}>
          <FocusTrap>
            <DismissibleLayer onEscapeKeyDown={onClose} onPointerDownOutside={onClose}>
              <ModalContent
                aria-labelledby={labelledBy}
                onClick={(e) => e.stopPropagation()}
                background="neutral0"
                hasRadius
                shadow="popupShadow"
                role="dialog"
                aria-modal
                {...props}
              />
            </DismissibleLayer>
          </FocusTrap>
        </ModalWrapper>
      </ModalContext.Provider>
    </Portal>
  );
};

ModalLayout.propTypes = {
  labelledBy: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

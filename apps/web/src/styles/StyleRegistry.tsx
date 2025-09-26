import React, { PropsWithChildren } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyleRegistry({ children }: PropsWithChildren) {
  // At SSR we wrap with ServerStyleSheet via StyleSheetManager
  // On client, styled-components just hydrates
  if (typeof window === 'undefined') {
    const sheet = new ServerStyleSheet();
    return (
      <StyleSheetManager sheet={sheet.instance}>
        {children}
      </StyleSheetManager>
    );
  }
  return <>{children}</>;
}





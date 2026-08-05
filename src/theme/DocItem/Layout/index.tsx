import React, { type ReactNode } from 'react';
import DocItemLayout from '@theme-original/DocItem/Layout';
import type { Props } from '@theme/DocItem/Layout';
import AIToolsDropdown from '@site/src/components/AIToolsDropdown';
import styles from './styles.module.css';

export default function DocItemLayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <div className={styles.aiToolsBar}>
        <AIToolsDropdown />
      </div>
      <DocItemLayout {...props} />
    </>
  );
}

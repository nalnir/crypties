import { CSSProperties, ReactNode } from 'react';

export interface WithClassName {
	className?: string;
}

export interface WithChildren {
	children?: ReactNode;
}

export interface WithOnClick {
	onClick: () => void;
}

export interface WithOnClickItem<T> {
	onClick: (e: T) => void;
}

export interface WithOnClickOptional {
	onClick?: (e?: any) => void;
}

export interface WithStyle {
	style?: CSSProperties;
}

export interface WithLoading {
	isLoading?: boolean;
}

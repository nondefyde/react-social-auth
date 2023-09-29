import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils'; // Import act for async tests
import FacebookProvider from '../FacebookProvider';
import FacebookContext, { FacebookContextInterface } from '../../FacebookContext/FacebookContext';
import Facebook from '../../../utils/facebook';

jest.mock('../../../utils/facebook', () => {
    return {
        default: jest.fn().mockImplementation(() => ({
            init: jest.fn().mockResolvedValue(undefined),
            parse: jest.fn().mockResolvedValue(undefined),
        }))
    }
});

describe('FacebookProvider', () => {
    it('should render children and provide the expected context value', async () => {
        const facebookOptions = {
            appId: 'your-app-id',
        };

        const { getByTestId } = render(
            <FacebookProvider {...facebookOptions}>
                <ChildComponent />
            </FacebookProvider>
        );

        await act(async () => {
            expect(Facebook).toHaveBeenCalledTimes(1);
        });

        const contextValue: FacebookContextInterface | undefined = (
            JSON.parse(getByTestId('facebook-context').getAttribute('data-context') as string)
        );

        expect(contextValue?.isLoading).toBe(false);
        expect(contextValue?.error).toBeUndefined();
        expect(contextValue?.api).toBeInstanceOf(Object);

    });
});

const ChildComponent = () => {
    return (
        <FacebookContext.Consumer>
            {(contextValue) => (
                <div data-testid="facebook-context" data-context={JSON.stringify(contextValue)} />
            )}
        </FacebookContext.Consumer>
    );
};

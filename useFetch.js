import { useEffect, useState } from 'react';

const initialState = {
    data: null,
    isLoading: true,
    hasErrror: false,
    error: null
};

const localCache = {};

export const useFetch = (url) => {

    const [state, setState] = useState(initialState);

    useEffect(() => {
        getFetch();
    }, [url]);

    const setLoadingState = () => {
        setState(initialState);
    }
    
    const getFetch = async() => {

        if (localCache[url]) {
            setState({
                data: localCache[url],
                isLoading: false,
                hasErrror: false,
                error: null
            });
            return;
        }

        setLoadingState();
        const resp = await fetch(url);  
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!resp.ok) {
            setState({
                data: null,
                isLoading: false,
                hasErrror: true,
                error: {
                    code: resp.status,
                    message: resp.statusText
                }
            });
            return;
        }

        const data = await resp.json();
        setState({
            data: data,
            isLoading: false,
            hasErrror: false,
            error: null
        });
        localCache[url] = data;
}

    return {
        data: state.data,
        isLoading: state.isLoading,
        hasErrror: state.hasErrror
    }
}

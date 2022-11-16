import axios from 'axios';
import { mountComposition } from 'vue-composition-test-utils'
import useAuth from './useAuth'

jest.mock('axios');

test('It should get current composition result', function () {
    const wrapper = mountComposition(useAuth);
    expect(wrapper.result.current.isLoading.value).toEqual(false);
    expect(wrapper.result.current.isAuth.value).toEqual(false);
    expect(wrapper.result.current.error.value).toBeNull();
});

test('It should get current value when trigger register', function () {
    mountComposition(async () => {
        // @ts-ignore
        axios.post.mockResolvedValueOnce({ data: {} });
        const { register, error } = useAuth();
        await register('/test/register_url', {email: 'test@test.com', password: 'test' });

        expect(error.value).toBeNull();
    });
});

test('It should get current value when trigger login', function () {
    mountComposition(async () => {
        const token = '12345678987654321'
        // @ts-ignore
        axios.post.mockResolvedValueOnce({ data: { token } });
        const { login, isAuth, error } = useAuth();
        await login('/test/login_url', { email: 'test@test.com', password: 'test' });

        expect(isAuth.value).toEqual(true);
        expect(error.value).toBeNull();
        expect(sessionStorage.getItem('token')).toEqual(token);
        expect(axios.defaults.headers.common['Authorization']).toEqual('Bearer ' + token);
    });
});

test('It should get current value when trigger logout', function () {
    mountComposition(async () => {
        const { logout } = useAuth();
        logout();

        expect(sessionStorage.getItem('token')).toBeNull();
        expect(axios.defaults.headers.common['Authorization']).toBeFalsy();
    });
});

test('It should render template with reactive values', async function () {
    const wrapper = mountComposition(useAuth, {
        component: {
            template: `<div>Auth: {{ result.current.isAuth.value }}, Loading: {{ result.current.isLoading.value }}, Error: {{ result.current.error.value }}</div>`
        }
    });

    // init
    expect(wrapper.html()).toEqual(`<div>Auth: false, Loading: false, Error: </div>`);
    const spy = jest.spyOn(wrapper.result.current.isLoading, 'value', 'set');

    // triggering an error
    // @ts-ignore
    axios.post.mockRejectedValueOnce({ response: 'an error...' });
    await wrapper.result.current.login('/test/login_url', { email: 'test@test.com', password: 'test' });
    expect(wrapper.html()).toEqual(`<div>Auth: false, Loading: false, Error: an error...</div>`);
    expect(spy).toHaveBeenCalled();

    // with success response
    // @ts-ignore
    axios.post.mockResolvedValueOnce({ data: { token: 'a token' } });
    await wrapper.result.current.login('/test/login_url', { email: 'test@test.com', password: 'test' });
    expect(wrapper.html()).toEqual(`<div>Auth: true, Loading: false, Error: </div>`);
});
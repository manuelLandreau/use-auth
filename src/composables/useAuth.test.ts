import useAuth from './useAuth'
import axios from 'axios';
import { mountComposition } from 'vue-composition-test-utils'

jest.mock('axios');

test('should get current composition result', function () {
    const wrapper = mountComposition(useAuth)
    expect(wrapper.result.current.isLoading.value).toEqual(false)
    expect(wrapper.result.current.isAuth.value).toEqual(false)
    expect(wrapper.result.current.error.value).toBeUndefined()
});

test('should get current value when trigger login/logout', function () {
    mountComposition(() => {
        const resp = { token: '12345678987654321' }
        axios.post.mockResolvedValue({ data: resp });
        const { login, logout, isAuth, error } = useAuth()
        login({ email: 'test@test.com', password: 'test' }, '/test/login_url').finally(() => null)
        expect(isAuth.value).toEqual(true)
        expect(error.value).toBeUndefined()
        expect(sessionStorage.getItem('jwt')).toEqual('12345678987654321')
        expect(axios.defaults.headers.common['Authorization']).toEqual('12345678987654321')

        logout()
        expect(isAuth.value).toEqual(false)
        expect(sessionStorage.getItem('jwt')).toBeNull()
    })
});

test('should get current value when trigger register', function () {
    mountComposition(() => {
        const resp = {}
        axios.post.mockResolvedValueOnce({ data: resp });
        const { register, error } = useAuth()
        register({ email: 'test@test.com', password: 'test' }, '/test/register_url').finally(() => null)
        expect(error.value).toBeUndefined()
    })
});

test('should render template though template option', async function () {
    const wrapper = mountComposition(useAuth, {
        component: {
            template: `<div>Error: {{ result.current.error.value }}</div>`
        }
    })
    expect(wrapper.html()).toEqual('<div>Error: </div>')
    axios.post.mockRejectedValueOnce({ response: 'an error...' });
    await wrapper.result.current.login({ email: 'test@test.com', password: 'test' }, '/test/login_url')
    expect(wrapper.html()).toEqual('<div>Error: an error...</div>')
    expect(wrapper.result.current.isAuth.value).toEqual(false)
});
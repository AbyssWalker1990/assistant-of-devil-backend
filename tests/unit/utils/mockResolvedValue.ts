export default (value?: unknown): jest.Mock => jest.fn().mockReturnValue(Promise.resolve(value))

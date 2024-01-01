export default (value?: unknown): jest.Mock => jest.fn().mockReturnValue(value)

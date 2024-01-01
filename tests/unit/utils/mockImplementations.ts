export default (implementation: () => void): jest.Mock => jest.fn().mockImplementation(implementation)

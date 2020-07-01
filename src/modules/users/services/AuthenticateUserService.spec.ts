import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('sould be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Gonçalves',
      email: 'rodrigo@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'rodrigo@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('sould be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'rodrigo@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('sould not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Rodrigo Gonçalves',
      email: 'rodrigo@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'rodrigo@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

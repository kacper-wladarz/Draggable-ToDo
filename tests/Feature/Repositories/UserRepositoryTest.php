<?php

namespace Tests\Feature\Repositories;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use DatabaseTransactions;

    private UserRepositoryInterface $userRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userRepository = resolve(UserRepositoryInterface::class);
    }

    #[Test]
    public function findByLoginReturnsExpectedValue(): void
    {
        $user = User::factory()->createOne(["login" => "john123@example.com"]);

        $result = $this->userRepository->findByLogin("john123@example.com");

        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals($user->id, $result->id);
    }

    #[Test]
    public function findByLoginThrowsExceptionWhenLoginDoesNotExist(): void
    {
        User::factory()->createOne(["login" => "john123@example.com"]);

        $this->expectException(ModelNotFoundException::class);
        $this->userRepository->findByLogin("not_existing_login");
    }

    #[Test]
    public function itCreatesNewUser()
    {
        $data = [
            "name" => "John",
            "login" => "john123@example.com",
            "password" => "password"
        ];

        $result = $this->userRepository->create($data);

        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals($data["login"], $result->login);

        $this->assertDatabaseHas(modelTableName(User::class), [
            "id" => $result->id,
            ...Arr::except($data, "password"),
        ]);

        $this->assertTrue(Hash::check("password", $result->password));
    }
}

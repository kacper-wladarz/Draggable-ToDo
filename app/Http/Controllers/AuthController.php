<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    public function __construct(private AuthServiceInterface $authService) {}

    public function me(Request $request): JsonResponse
    {
        return response()->json(["user" => $request->user()], Response::HTTP_OK);
    }

    public function login(Request $request): JsonResponse
    {
        $userData = $this->authService->login($request->all());

        return response()->json($userData, Response::HTTP_ACCEPTED);
    }

    public function registration(Request $request): JsonResponse
    {
        $userData = $this->authService->register($request->all());

        return response()->json($userData, Response::HTTP_CREATED);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}

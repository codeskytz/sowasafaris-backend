<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class AdminLoginResponse implements LoginResponseContract
{
    /**
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request): \Symfony\Component\HttpFoundation\Response
    {
        $isAdmin = (bool) $request->user()?->is_admin;
        $destination = $isAdmin ? route('dashboard') : route('home');
        $intendedUrl = $request->session()->get('url.intended');

        if (
            ! $isAdmin &&
            is_string($intendedUrl) &&
            str_contains($intendedUrl, '/sowa-admin')
        ) {
            $request->session()->forget('url.intended');
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => false, 'redirect' => $destination])
            : redirect()->intended($destination);
    }
}

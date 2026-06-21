<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EnvController extends Controller
{
    /**
     * Update DB credentials in the .env file.
     *
     * Expected JSON payload:
     * {
     *   "DB_USERNAME": "new_user",
     *   "DB_PASSWORD": "new_pass"
     * }
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'DB_USERNAME' => 'required|string',
            'DB_PASSWORD' => 'required|string',
        ]);

        $envPath = base_path('.env');
        $env = file_get_contents($envPath);
        // Replace or add the lines
        $env = preg_replace('/^DB_USERNAME=.*/m', 'DB_USERNAME='.$data['DB_USERNAME'], $env);
        $env = preg_replace('/^DB_PASSWORD=.*/m', 'DB_PASSWORD='.$data['DB_PASSWORD'], $env);
        file_put_contents($envPath, $env);

        return response()->json(['message' => 'Database credentials updated']);
    }
}

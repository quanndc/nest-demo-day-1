import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {

    @ApiProperty({
        description: 'Access token is used to authenticate the user, it is a JWT token, it will be expired in 1 hour, it needs to be included in request header as Bearer token',
        example: "abcyxz"
    })
    accessToken: string;

    @ApiProperty({
        description: 'Refresh token is used to get new access token, it is a JWT token, it will be expired in 7 days',
        example: "xyzabc"
    })
    refreshToken: string;
}
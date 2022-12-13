import {rest} from 'msw';

const BASE_URL = 'http://localhost:3001';

export const handlers = [
    // rest.post(`${BASE_URL}/users/login`, (req, res, ctx) => {
    //     //const token = 'testToken';
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiVGVzdHkiLCJzdXBlckFkbWluIjp0cnVlLCJvcmdhbml6YXRpb25zIjp7IjM5Ijp7Im9yZ05hbWUiOiJvcmc5OTkiLCJhZG1pbkxldmVsIjoxfX19LCJpYXQiOjE2NzA5Njc2NDh9.lfM8jha8t1bDI_bSIkPrIIvJRXOOGT8wT8H9zzD9hUc';
    //     return res(ctx.json({token}));
    // })

];
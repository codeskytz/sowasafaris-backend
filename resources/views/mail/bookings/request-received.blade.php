@php
    $logoPath = public_path('logo.png');
    $logoSource = file_exists($logoPath) ? $message->embed($logoPath) : asset('logo.png');
    $safariName = $booking->safari?->name ?? 'Selected safari';
    $tierName = $booking->pricingTier?->name ?? $booking->service_tier;
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sowa Safaris booking request received</title>
</head>
<body style="margin: 0; padding: 0; background: #f2f4f3; color: #191c1c; font-family: Manrope, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f2f4f3; margin: 0; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 680px; overflow: hidden; border-radius: 24px; background: #ffffff; box-shadow: 0 24px 40px rgba(25, 28, 28, 0.08);">
                    <tr>
                        <td style="padding: 0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #01261f;">
                                <tr>
                                    <td style="padding: 32px 28px 28px;">
                                        <img src="{{ $logoSource }}" alt="Sowa Safari &amp; Adventures logo" width="150" style="display: block; width: 150px; max-width: 150px; height: auto; margin: 0 0 24px;">
                                        <p style="margin: 0 0 10px; color: #ffba20; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Booking request received</p>
                                        <h1 style="margin: 0; color: #ffffff; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 1.08; font-weight: 700;">We are preparing your safari plan.</h1>
                                        <p style="max-width: 520px; margin: 16px 0 0; color: #d8dad9; font-size: 16px; line-height: 1.7;">Hello {{ $booking->customer_name }}, thank you for choosing Sowa Safaris. Our team received your request and will contact you as soon as possible to confirm details, availability, and next steps.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px 28px 10px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #c1c8c4; border-radius: 18px; background: #f8faf9;">
                                <tr>
                                    <td style="padding: 22px;">
                                        <p style="margin: 0 0 14px; color: #705a44; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Request summary</p>

                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #414846; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Reference</td>
                                                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #191c1c; font-size: 15px; font-weight: 800;">{{ $booking->reference }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #414846; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Safari</td>
                                                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #191c1c; font-size: 15px; font-weight: 800;">{{ $safariName }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #414846; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Service tier</td>
                                                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #191c1c; font-size: 15px; font-weight: 800;">{{ $tierName }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #414846; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Departure month</td>
                                                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #191c1c; font-size: 15px; font-weight: 800;">{{ $booking->departure_month }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #414846; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Travelers</td>
                                                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e1e3e2; color: #191c1c; font-size: 15px; font-weight: 800;">{{ $booking->travelers }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 14px 0 0; color: #414846; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Estimated total</td>
                                                <td align="right" style="padding: 14px 0 0; color: #01261f; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 700;">${{ number_format($booking->estimated_total) }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 18px 28px 30px;">
                            <p style="margin: 0 0 16px; color: #414846; font-size: 15px; line-height: 1.75;">If anything in your request needs to change, reply to this email and we will help update it before the planning call.</p>
                            <p style="margin: 0; color: #191c1c; font-size: 15px; line-height: 1.75;">Warm regards,<br><strong style="color: #01261f;">Sowa Safaris Team</strong></p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 28px; background: #fcddc0; color: #57432e; font-size: 12px; line-height: 1.6; text-align: center;">
                            Sowa Safari &amp; Adventures | Experience Safari Like Never Before
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

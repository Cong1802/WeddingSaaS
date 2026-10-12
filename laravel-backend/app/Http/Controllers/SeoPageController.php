<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class SeoPageController extends Controller
{
    public function sitemap()
    {
        $url = htmlspecialchars(rtrim(config('seo.url'), '/').'/', ENT_XML1, 'UTF-8');
        return response('<?xml version="1.0" encoding="UTF-8"?>' .
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'.$url.'</loc></url></urlset>')
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function page(Request $request)
    {
        $home = $request->path() === '/' && !$request->hasAny(['v', 'page', 'admin', 'reset_token']);
        $indexPath = public_path($home ? 'dist/landing.html' : 'dist/index.html');
        if (!is_file($indexPath)) {
            return response('Giao diện đang được cập nhật. Vui lòng tải lại sau ít giây.', 503)->header('Retry-After', '3');
        }
        $url = rtrim(config('seo.url'), '/');
        $canonical = $url.'/';
        $settings = Schema::hasTable('system_settings') ? SystemSetting::whereIn('key', ['site_title', 'site_description'])->pluck('value', 'key')->all() : [];
        $landingTitle = trim($settings['site_title'] ?? '') ?: config('seo.title');
        $description = trim($settings['site_description'] ?? '') ?: config('seo.description');
        if ($landingTitle === 'Thiệp Cưới Online Thông Minh & Đẳng Cấp 2026') $landingTitle = config('seo.title');
        if ($description === 'Nền tảng tạo thiệp cưới online cao cấp, thiết kế đẹp mắt, nhận mừng cưới tự động VietQR, gửi lời chúc & album ảnh cưới.') $description = config('seo.description');
        $title = $home ? $landingTitle : ($request->is('templates') ? 'Mẫu thiệp cưới online | WeddingSaaS' : 'WeddingSaaS');
        $escape = fn ($value) => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        $html = file_get_contents($indexPath);
        $html = preg_replace('/<title>.*?<\/title>/s', '<title>'.$escape($title).'</title>', $html);
        $html = preg_replace('/<meta name="description"[^>]*>/', '<meta name="description" content="'.$escape($description).'" />', $html);
        $robots = $home ? 'index, follow, max-image-preview:large' : 'noindex, follow';
        $head = '<meta name="robots" content="'.$robots.'" /><meta name="seo-base-url" content="'.$escape($canonical).'" /><meta name="seo-landing-title" content="'.$escape($landingTitle).'" />';
        if ($home) {
            $image = $url.'/seo/thiep-cuoi-online.jpg';
            $head .= '<link rel="canonical" href="'.$escape($canonical).'" />';
            foreach (['og:type' => 'website', 'og:locale' => 'vi_VN', 'og:site_name' => config('seo.name'), 'og:title' => $title, 'og:description' => $description, 'og:url' => $canonical, 'og:image' => $image, 'og:image:alt' => 'Mẫu thiệp cưới online WeddingSaaS trên điện thoại'] as $property => $content) {
                $head .= '<meta property="'.$property.'" content="'.$escape($content).'" />';
            }
            foreach (['twitter:card' => 'summary_large_image', 'twitter:title' => $title, 'twitter:description' => $description, 'twitter:image' => $image] as $name => $content) {
                $head .= '<meta name="'.$name.'" content="'.$escape($content).'" />';
            }
            $schema = ['@context' => 'https://schema.org', '@graph' => [
                ['@type' => 'Organization', '@id' => $canonical.'#organization', 'name' => config('seo.name'), 'url' => $canonical],
                ['@type' => 'WebSite', '@id' => $canonical.'#website', 'name' => config('seo.name'), 'url' => $canonical, 'inLanguage' => 'vi', 'publisher' => ['@id' => $canonical.'#organization']],
                ['@type' => 'WebPage', '@id' => $canonical.'#webpage', 'url' => $canonical, 'name' => $title, 'description' => $description, 'inLanguage' => 'vi', 'isPartOf' => ['@id' => $canonical.'#website']],
            ]];
            $head .= '<script id="landing-schema" type="application/ld+json">'.json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT).'</script>';
        }
        $html = str_replace('</head>', $head.'</head>', $html);
        return response($html)->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Cache-Control', 'no-cache, must-revalidate')
            ->header('X-Robots-Tag', $robots);
    }
}

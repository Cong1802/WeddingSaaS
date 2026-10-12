<?php

namespace Tests\Feature;

use Tests\TestCase;

class LandingSeoTest extends TestCase
{
    public function test_landing_contains_content_and_consistent_metadata_without_javascript(): void
    {
        $response = $this->get('/');
        $response->assertOk()->assertHeader('X-Robots-Tag', 'index, follow, max-image-preview:large');
        $html = $response->getContent();
        $this->assertStringContainsString('<html lang="vi">', $html);
        $this->assertSame(1, substr_count($html, '<h1'));
        $this->assertSame(1, substr_count($html, 'rel="canonical"'));
        $this->assertStringContainsString('href="https://weddingsaas.online/"', $html);
        $this->assertStringContainsString('Tạo Thiệp Cưới Online', $html);
        $this->assertStringContainsString('id="faq"', $html);
        preg_match('/<script id="landing-schema" type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);
        $schema = json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);
        $this->assertSame('https://weddingsaas.online/', $schema['@graph'][1]['url']);
        $this->assertStringContainsString('property="og:url" content="https://weddingsaas.online/"', $html);
    }

    public function test_tracking_parameters_keep_the_homepage_canonical(): void
    {
        $this->get('/?utm_source=zalo')->assertOk()
            ->assertSee('rel="canonical" href="https://weddingsaas.online/"', false);
    }

    public function test_application_and_shared_card_urls_are_not_indexable(): void
    {
        foreach (['/admin/dashboard', '/editor', '/my-cards', '/?v=private-card', '/?reset_token=example', '/?page=admin'] as $url) {
            $response = $this->get($url);
            $response->assertOk()->assertHeader('X-Robots-Tag', 'noindex, follow');
            $this->assertStringNotContainsString('rel="canonical"', $response->getContent());
            $this->assertStringNotContainsString('id="hero-title"', $response->getContent());
        }
    }

    public function test_sitemap_contains_the_canonical_landing_url_only(): void
    {
        $this->get('/sitemap.xml')->assertOk()->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('<loc>https://weddingsaas.online/</loc>', false)->assertDontSee('/admin');
    }
}

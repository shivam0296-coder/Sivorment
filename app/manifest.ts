import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Sivorment — Create a Nature World', short_name: 'Sivorment', description: 'A digital world where nature becomes the interface.', start_url: '/', display: 'standalone', background_color: '#08130f', theme_color: '#08130f' };
}

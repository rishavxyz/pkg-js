export default function createFlags(...flags: string[]) {
  return flags.map(flag => {

    const type: 'string' | 'boolean' =
    flag.includes('=') ? 'string' : 'boolean';
    
    if (type == 'string') flag = flag.split('=')[0];

    const [short, long] = flag.split('/');

    return {
      [long ?? short]: {
        type,
        short: short && long ? short : undefined
      }
    }
  })
}
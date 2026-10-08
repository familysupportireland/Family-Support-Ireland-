import type { DocumentTypeId } from '../types';

export const FORMS_CATALOG: {
id: DocumentTypeId;
title: string;
description: string;
}[] = [
{
id: 'safety-order',
title: 'Domestic Violence Safety Order',
description: 'Information and preparation for a safety order application.',
},
{
id: 'maintenance',
title: 'Child Maintenance',
description: 'Prepare information about child maintenance.',
},
{
id: 'custody-access',
title: 'Custody and Access',
description: 'Organise information about parenting arrangements.',
},
{
id: 'divorce',
title: 'Divorce',
description: 'Organise information for a divorce application.',
},
];

import { DefaultTemplate } from '../../components/templates/DefaultTemplate';
import { Analytics as AnalyticsOrganism } from '../../components/organisms/Analytics';
import { useRocketStats } from '../../hooks/useRocketStats';

export const Analytics = () => {
    const { dashSummary } = useRocketStats('dashboard');

    return (
        <DefaultTemplate
            search=""
            onSearchChange={() => { }}
            categories={[]}
            selectedCategory=""
            onCategorySelect={() => { }}
        >
            <AnalyticsOrganism dashSummary={dashSummary} />
        </DefaultTemplate>
    );
};

export default Analytics;

export class Feedback {
    feedback_id: number;
    
    feedback_content: string;
    feedback_context: string;
    feedback_steps_to_reproduce: string;
    feedback_problem: string;
    feedback_solution: string;
    
    feedback_is_processed: boolean; 
    feedback_is_deleted: boolean;
    feedback_type_id: number;
    feedback_type_name: string;
    
    feedback_criticality: number;
    feedback_importance: number;
    feedback_star_rating: number;
    feedbacker_name: string;
    company_name: string;
    product_name: string;
    reply_content: string;
}
